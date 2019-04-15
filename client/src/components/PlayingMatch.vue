<template>
	<div>
		<div
			class="choose-player-container section"
			v-if="myTurn && !entity.id && !ended"
		>
			<h3>Wähle einen Spieler den du angreifen möchtest</h3>
			<div class="entity-box">
				<button
					class="btn btn-primary mr-1 mb-1"
					v-on:click="changeEntity(player)"
					v-for="player in otherPlayers"
					v-bind:key="player.id"
				>
					<i class="fas fa-skull mr-3"></i>{{ player.username }}
				</button>
			</div>
		</div>

		<div class="choose-player-container section" v-if="entity.id && !ended">
			<h3>
				Gebiet von <b>{{ entity.username }}</b>
			</h3>
			<ShipInfoComponent v-bind:sunkShips="sunkShips" />
			<Field v-bind:game="game" v-bind:allowShoot="true" />

			<button
				class="btn btn-secondary mt-5 btn-mobile-block"
				v-if="game.playerIDs.length > 2"
				v-on:click="showChangeEntity()"
			>
				Anderen Gegner wählen
			</button>
		</div>

		<div
			class="choose-player-container section"
			v-if="!myTurn && !ended && inRound"
		>
			<h3>
				<b>{{ playerInTurn.username }}</b> ist am Zug
			</h3>
			<div class="spectator-field">
				<h3 class="mt-5">
					Deine Flotte:
				</h3>
				<ShipInfoComponent v-bind:sunkShips="sunkShips" />
				<Field v-bind:game="game" v-bind:allowShoot="false" />
			</div>
		</div>

		<div class="game-is-sick" v-if="!inRound && !entity.id">
			<h3>
				<div class="spinner-grow text-light" role="status">
					<span class="sr-only">Loading...</span>
				</div>
				Einen Moment, Soldat..!
			</h3>
			<div
				class="admin-container"
				v-if="player.id == game.playerIDs[0] && reloadGameButton"
			>
				<p></p>
				<button class="btn btn-primary" v-on:click="reloadGame()">
					Spiel nachladen
				</button>
			</div>
		</div>

		<div
			class="alert mt-2 fixed-bottom mx-5"
			v-bind:class="{
				'alert-info': message.state == 'info',
				'alert-danger': message.state == 'danger',
				'alert-success': message.state == 'success',
				'alert-warning': message.state == 'warning'
			}"
			v-if="message.show"
			v-html="message.msg"
		></div>
	</div>
</template>

<script>
import GameService from '@/services/GameService.js';
import PlayerService from '@/services/PlayerService.js';

import ShipInfoComponent from '@/components/match/ShipInfoComponent.vue';
import Field from '@/components/match/Field.vue';

export default {
	name: 'PlayingMatch',
	components: {
		ShipInfoComponent,
		Field
	},
	data() {
		return {
			game: {
				playerIDs: [],
				currentEntity: {}
			},
			fields: [],
			player: {},
			gameCode: '',
			inRound: false,
			ended: false,
			sunkShips: [],
			message: {
				show: false,
				msg: '',
				state: 'info'
			},
			myTurn: false,
			shooted: false,
			playerInTurn: {},
			otherPlayers: [],
			entity: {},
			reloadGameButton: false
		};
	},
	async created() {
		// get gameCode for getting game
		const gameCode = this.$route.params.gameCode;
		this.gameCode = gameCode;
		try {
			GameService.getGame(gameCode).then(async game => {
				this.game = game;
				this.player = this.$store.state.player;

				// check user rights, states, etc.
				await this.startupCheck();

				// start game (managed server-side)
				this.$socket.emit('startGame', {
					gameCode: this.game.gameCode
				});
			});
		} catch (err) {
			this.$router.push({
				name: 'home',
				params: {
					error: 'Sorry, da ist etwas schief gelaufen.. (Fehlercode: #PM)'
				}
			});
		}

		// show refresh button after 10 seconds
		setTimeout(() => {
			this.reloadGameButton = true;
		}, 1000);
		//TODO CHANGE
	},
	methods: {
		fillFields() {
			this.fields = [];
			for (let x = 0; x < this.game.fieldsize; x++) {
				for (let y = 0; y < this.game.fieldsize; y++) {
					this.fields.push({
						x,
						y,
						ship: false,
						hit: false,
						shipHit: false
					});
				}
			}
		},
		fillOwnFields() {
			this.fillFields();

			// set own hits
			this.sunkShips = [];

			this.setHits(this.player);

			// set ships (visible)
			this.player.ships.forEach(ship => {
				let field = this.getField(ship.x, ship.y);
				field.ship = true;
				field.end = ship.end;
				field.start = ship.start;
				field.orientation = ship.orientation;
				field.special = ship.special;
			});
		},
		setHits(player) {
			player.hits.forEach(hit => {
				let field = this.getField(hit.x, hit.y);
				field.hit = true;

				// if hit is ship hit
				player.ships.forEach(ship => {
					if (ship.x === hit.x && ship.y === hit.y) {
						field.shipHit = true;

						let shipHits = 0;
						player.ships.forEach(s => {
							if (s.id === ship.id) {
								let f = this.getField(s.x, s.y);

								if (f.hit) shipHits++;
							}
						});

						// if ship is hitted completely
						if (shipHits === ship.length) {
							// field.hasShip = true;
							// field.start = ship.start;
							// field.end = ship.end;
							// field.orientation = ship.orientation;
							this.sunkShips.push({
								id: ship.id,
								length: ship.length
							});
						}
					}
				});
			});
		},
		async shoot(x, y) {
			// check if already shoot
			if (this.shooted) {
				return false;
			}

			// check if not hitted before
			let hitted = false;
			this.entity.hits.forEach(hit => {
				if (hit.x === x && hit.y === y) {
					hitted = true;
				}
			});
			if (hitted) {
				// this.showMessage(
				// 	'Dieses Feld wurde bereits beschossen. Bitte wähle ein anderes aus.',
				// 	'warning'
				// );
				return false;
			}

			// add hit to entities field
			this.entity.hits.push({
				x,
				y,
				playerID: this.player.id
			});

			this.shooted = true;

			let field = this.getField(x, y);
			field.hit = true;

			// loop over all ships and search for hit
			let shipHit = false;
			this.entity.ships.forEach(ship => {
				if (ship.x === x && ship.y === y && !ship.hit) {
					ship.hit = true;
					field.shipHit = true;
					this.showMessage(
						`Deine Bombe ist auf dem Schiff von <b>${
							this.entity.username
						}</b> gelandet! Sehr gut!`,
						'info'
					);
					shipHit = true;
					this.shooted = false;

					// send message to entity
					this.$socket.emit('playingUpdate', {
						gameCode: this.game.gameCode,
						attacker: this.player,
						entity: this.entity,
						type: 'hit'
					});

					// check if ship is completed
					let shipHits = 0;
					this.entity.ships.forEach(s => {
						if (s.id === ship.id) {
							let field = this.getField(s.x, s.y);

							if (field.hit) shipHits++;
						}
					});

					// if ship is hitted completely
					if (shipHits === ship.length) {
						ship.sunk = true;
						this.showMessage(
							`Du hast ein Schiff von <b>${
								this.entity.username
							}</b> versenkt! Sehr gut, Captain!`,
							'success'
						);

						this.sunkShips.push({
							id: ship.id,
							length: ship.length
						});

						// send message to entity
						this.$socket.emit('playingUpdate', {
							gameCode: this.game.gameCode,
							attacker: this.player,
							entity: this.entity,
							type: 'sunk'
						});
					}
				}
			});

			// check if all ships down => show end sequence
			const hittedShipParts = this.entity.ships.filter(ship => ship.hit);
			let shipPartsSunk = hittedShipParts.length;
			if (shipPartsSunk === this.entity.ships.length && shipPartsSunk > 0) {
				this.$socket.emit('playingUpdate', {
					gameCode: this.game.gameCode,
					attacker: this.player,
					type: 'winner'
				});
				this.showMessage(
					`Glückwunsch, Soldat! Du hast die Schlacht gewonnen!`,
					'success'
				);

				// set winner to game
				this.game.winner = this.player;

				this.game.state = 2;
				this.game = await GameService.updateGame(this.game);

				// redirect to home screen
				setTimeout(() => {
					this.$router.push(`/match/${this.game.gameCode}/ending`);
				}, 3000);

				// TODO for ranking
				// this.$socket.emit('deadPlayer', {gameCode: this.gameCode, loser: this.entity});
			}

			// update entity
			this.entity = await PlayerService.updatePlayer(this.entity);

			// when no ship hit => next player
			if (!shipHit) {
				this.inRound = false;
				this.$socket.emit('nextPlayer', { gameCode: this.gameCode });
			}
		},
		showChangeEntity() {
			this.entity = {};
		},
		async changeEntity(entity) {
			this.entity = entity;

			// get current game to avoid update problems
			this.game = await GameService.getGame(this.game.gameCode);

			// update current game
			this.game.currentEntity = entity;

			// update game
			this.game = await GameService.updateGame(this.game);

			// fill fields with current fieldsize
			this.fillFields();

			// reset sunken ships => set new in this method
			this.sunkShips = [];

			// set hits
			this.setHits(this.entity);
		},
		async startupCheck() {
			return new Promise((resolve, reject) => {
				// if player is not in game
				if (!GameService.playerIsInGame(this.player, this.game)) {
					this.$router.push({
						name: 'home',
						params: {
							error: 'Ich glaube nicht, dass du hier richtig bist..'
						}
					});
				}
				resolve();
			});
		},
		showMessage(msg, state = 'info', hide = 5) {
			this.message.msg = msg;
			this.message.state = state;
			this.message.show = true;

			clearTimeout(this.message.timeout);
			this.message.timeout = setTimeout(() => {
				this.hideMessage();
			}, hide * 1000);
		},
		hideMessage() {
			this.message.show = false;
		},
		getField(x, y) {
			return this.fields.filter(f => f.x === x && f.y === y)[0];
		},
		reloadGame() {
			this.$socket.emit('nextPlayer', { gameCode: this.game.gameCode });
			this.showMessage('Spiel nachladen..!', 'warning');
		}
	},
	sockets: {
		nextPlayer: async function(data) {
			// if emit is for current game
			if (this.game.gameCode == data.gameCode) {
				// TODO ERROR HANDLING OR REDIRECT TO END PAGE
				if (this.ended) {
					return false;
				}

				// reset view data
				this.entity = {};
				this.shooted = false;
				this.hideMessage();

				// get refreshed game var
				const gameCode = this.$route.params.gameCode;
				GameService.getGame(gameCode).then(async game => {
					this.game = game;
					this.game.currentEntity = {};
				});

				// update player obj
				this.player = await PlayerService.getPlayer(
					this.$store.state.player.id
				);

				// set new socket vars
				this.otherPlayers = data.otherPlayers;
				this.inRound = true;

				if (data.playerInTurn.id === this.player.id) {
					// own turn
					this.myTurn = true;

					// if two players => choose entity directly
					if (this.game.playerIDs.length === 2) {
						this.changeEntity(this.otherPlayers[0]);
					}
				} else {
					// others turn
					this.myTurn = false;
					this.playerInTurn = data.playerInTurn;

					// fill own field
					this.fillOwnFields();
				}
			}
		},
		playingUpdate: async function(data) {
			// if emit is for current game
			if (this.game.gameCode == data.gameCode) {
				// dont show message when player is current player
				if (this.player.id == data.attacker.id) return false;

				switch (data.type) {
					case 'hit':
						this.showMessage(
							`<b>${data.attacker.username}</b> hat ein Schiff von <b>${
								data.entity.username
							}</b> getroffen!`,
							'info'
						);
						break;
					case 'sunk':
						this.showMessage(
							`<b>${data.attacker.username}</b> hat ein Schiff von <b>${
								data.entity.username
							}</b> versenkt!`,
							'info'
						);
						break;
					case 'updateSpectatorView':
						this.game = await GameService.getGame(this.game.gameCode);

						console.log(data);
						break;
					case 'winner':
						this.ended = true;
						this.showMessage('Der Krieg ist vorbei!', 'success');

						setTimeout(() => {
							this.$router.push(`/match/${this.game.gameCode}/ending`);
						}, 3000);
						break;
				}
			}
		}
	}
};
</script>
<style>
.ship-info-container {
	padding: 1rem 2rem;
	border-radius: 15px;
	background-color: rgba(255, 255, 255, 0.5);
	width: 560px;
	margin: 0 auto;
}
.ship-info-container .ship {
	display: flex;
	margin: 0.5rem 0;
}
.ship-info-container .ship > div {
	height: 40px;
	width: 40px;
	margin: 0;
	padding: 0;
	border: 2px solid #08628a;
	margin: 1px;
}
.ship-info-container .ship.completed > div {
	background-color: #08628a;
}
</style>
