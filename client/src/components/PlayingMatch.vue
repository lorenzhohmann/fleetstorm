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
		>
			{{ message.msg }}
		</div>
		<div
			class="choose-player-container section"
			v-if="myTurn && !entity.id"
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
		<div class="choose-player-container section" v-if="entity.id">
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
							x: getField(x - 1, y - 1).orientation == 'x',
							y: getField(x - 1, y - 1).orientation == 'y'
						}"
					></td>
				</tr>
			</table>
		</div>
		<div class="choose-player-container section" v-if="!myTurn">
			<h3>
				<b>{{ playerInTurn.username }}</b> ist am Zug
			</h3>
		</div>
	</div>
</template>

<script>
import GameService from '@/services/GameService.js';
import PlayerService from '@/services/PlayerService.js';

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
			showCountdown: true,
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
					error:
						'Sorry, da ist etwas schief gelaufen.. (Fehlercode: #PM)'
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
				this.showMessage(
					'Dieses Feld wurde bereits beschossen. Bitte wähle ein anderes aus.',
					'warning'
				);
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
						'Ein gegnerisches Schiff wurde getroffen! Gut gemacht, Soldat! Du hast noch einen Versuch.',
						'info'
					);
					shipHit = true;
					this.shooted = false;

					// check if ship is completed
					let shipHits = 0;
					this.entity.ships.forEach(s => {
						if (s.id === ship.id) {
							console.log('ids: ' + s.id + ' ' + ship.id);
							let field = this.getField(s.x, s.y);

							if (field.hit) shipHits++;
						}
					});
					console.log(shipHits, ship.length);
					if (shipHits === ship.length) {
						ship.sunk = true;
						this.showMessage(
							'Schiff versenkt, Captain!',
							'success'
						);
					}
				}
			});

			// check if all ships down => show end sequence
			if (false) {
				alert('SPIEL BEENDET');
			}

			this.entity = await PlayerService.updatePlayer(this.entity);

			// when no ship hit => next player
			if (!shipHit) {
				this.$socket.emit('nextPlayer', { gameCode: this.gameCode });
			}
		},
		entityChanged(entity) {
			this.fillFields();

			this.entity = entity;

			// set hits
			this.entity.hits.forEach(hit => {
				let field = this.getField(hit.x, hit.y);
				field.hit = true;

				// if hit is ship hit
				if (
					this.entity.ships.filter(
						ship => ship.x === hit.x && ship.y === hit.y
					).length
				) {
					field.shipHit = true;
				}
			});
		},
		async startupCheck() {
			return new Promise((resolve, reject) => {
				// if player is not in game
				if (!GameService.playerIsInGame(this.player, this.game)) {
					this.$router.push({
						name: 'home',
						params: {
							error:
								'Ich glaube nicht, dass du hier richtig bist..'
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
		}
	},
	sockets: {
		nextPlayer: function(data) {
			// reset view data
			this.entity = {};
			this.shooted = false;
			this.hideMessage();

			// if emit is for current game
			if (this.game.gameCode == data.gameCode) {
				// get refreshed game var
				const gameCode = this.$route.params.gameCode;
				GameService.getGame(gameCode).then(async game => {
					this.game = game;
				});

				if (data.playerInTurn.id === this.player.id) {
					// own turn
					this.myTurn = true;
					console.log('my turn');
				} else {
					// others turn
					this.myTurn = false;
					this.playerInTurn = data.playerInTurn;
					console.log('not my turn');
				}

				this.otherPlayers = data.otherPlayers;
			}
		}
	}
};
</script>
