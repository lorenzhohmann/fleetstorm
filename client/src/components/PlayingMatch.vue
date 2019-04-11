<template>
	<div>
		<div
			class="alert"
			v-bind:class="{
				'alert-info': message.state == 'info',
				'alert-danger': message.state == 'danger',
				'alert-success': message.state == 'success',
				'alert-warning': message.state == 'warning'
			}"
			v-if="message.show"
			v-html="message.msg"
		></div>
		<div
			class="choose-player-container section"
			v-if="myTurn && !entity.id && !ended"
		>
			<h3>Wähle einen Spieler den du angreifen möchtest</h3>
			<div class="entity-box">
				<button
					class="btn btn-primary mr-1"
					v-on:click="entityChanged(player)"
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
			<table class="matchfield">
				<tr v-for="y in game.fieldsize" v-bind:key="y">
					<td
						v-on:click="shoot(x - 1, y - 1)"
						v-if="getField(x - 1, y - 1)"
						v-for="x in game.fieldsize"
						v-bind:key="x"
						v-bind:class="{
							hasShip: getField(x - 1, y - 1).ship,
							end: getField(x - 1, y - 1).end,
							start: getField(x - 1, y - 1).start,
							hit: getField(x - 1, y - 1).hit,
							shipHit: getField(x - 1, y - 1).shipHit,
							hasShip: getField(x - 1, y - 1).hasShip,
							x: getField(x - 1, y - 1).orientation == 'x',
							y: getField(x - 1, y - 1).orientation == 'y'
						}"
					></td>
				</tr>
			</table>
		</div>
		<div class="choose-player-container section" v-if="!myTurn && !ended">
			<h3 v-if="inRound">
				<b>{{ playerInTurn.username }}</b> ist am Zug
			</h3>
		</div>
		<div class="game-is-sick" v-if="!inRound && !entity.id">
			<h3>
				<div class="spinner-grow text-light" role="status">
					<span class="sr-only">Loading...</span>
				</div>
				Einen Moment, Soldat..!
			</h3>
			<div class="admin-container" v-if="player.id == game.playerIDs[0]">
				<p></p>
				<button class="btn btn-primary" v-on:click="reloadGame()">
					Spiel nachladen
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import GameService from '@/services/GameService.js';
import PlayerService from '@/services/PlayerService.js';

// TODO: SPIEL HÄNGT FÜR ALLE ANZEIGEN NACH 5 SEKUNDEN => BEI KLICK MSG AN SERVER

export default {
	name: 'PlayingMatch',
	data() {
		return {
			game: {
				playerIDs: []
			},
			fields: [],
			player: {},
			gameCode: '',
			inRound: false,
			ended: false,
			message: {
				show: false,
				msg: '',
				state: 'info'
			},
			myTurn: false,
			shooted: false,
			playerInTurn: {},
			otherPlayers: [],
			entity: {}
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

			// set ship attributes
			this.entity.ships.forEach(ship => {
				let field = this.getField(ship.x, ship.y);
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
					this.$socket.emit('hit', {
						gameCode: this.game.gameCode,
						attacker: this.player,
						entity: this.entity,
						type: 'normal'
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

						// send message to entity
						this.$socket.emit('hit', {
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
				this.$socket.emit('hit', {
					gameCode: this.game.gameCode,
					attacker: this.player,
					type: 'winner'
				});
				this.showMessage(
					`Glückwunsch, Solat! Du hast die Schlach gewonnen!`,
					'success'
				);

				this.game.state = 2;
				this.game = await GameService.updateGame(this.game);

				// redirect to home after 5 seconds
				setTimeout(() => {
					this.$router.push({
						name: 'home',
						params: {
							error: 'Das Spiel ist vorbei!'
						}
					});
				}, 5000);
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
		entityChanged(entity) {
			this.entity = entity;

			this.fillFields();

			// set hits
			this.entity.hits.forEach(hit => {
				let field = this.getField(hit.x, hit.y);
				field.hit = true;

				// if hit is ship hit
				this.entity.ships.forEach(ship => {
					if (ship.x === hit.x && ship.y === hit.y) {
						field.shipHit = true;

						// TODO only when ship is completely hitted
						// let shipHits = 0;
						// this.entity.ships.forEach(s => {
						// 	if (s.id === ship.id) {
						// 		let f = this.getField(s.x, s.y);

						// 		if (f.hit) shipHits++;
						// 	}
						// });

						// // if ship is hitted completely
						// if (shipHits === ship.length) {
						// 	field.hasShip = true;
						// 	field.start = ship.start;
						// 	field.end = ship.end;
						// 	field.orientation = ship.orientation;
						// }
					}
				});
			});
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
		showMessage(msg, state = 'info') {
			this.message.msg = msg;
			this.message.state = state;
			this.message.show = true;
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
		nextPlayer: function(data) {
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
				});

				// set new socket vars
				this.otherPlayers = data.otherPlayers;
				this.inRound = true;

				if (data.playerInTurn.id === this.player.id) {
					// own turn
					this.myTurn = true;
					console.log('my turn');

					// if two players => choose entity directly
					if (this.game.playerIDs.length === 2) {
						this.entityChanged(this.otherPlayers[0]);
					}
				} else {
					// others turn
					this.myTurn = false;
					this.playerInTurn = data.playerInTurn;
					console.log('not my turn');
				}
			}
		},
		hit: function(data) {
			// if emit is for current game
			if (this.game.gameCode == data.gameCode) {
				// dont show message when player is current player
				if (this.player.id == data.attacker.id) return false;

				switch (data.type) {
					case 'normal':
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
					case 'winner':
						this.ended = true;
						this.showMessage(
							`<b>${data.attacker.username}</b> hat die Schlacht gewonnen!`,
							'success'
						);
						break;
				}
			}
		}
	}
};
</script>
