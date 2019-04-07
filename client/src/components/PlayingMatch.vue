<template>
	<div>
		<div
			class="alert"
			v-bind:class="{
				'alert-info': message.state == 'info',
				'alert-danger': message.state == 'danger',
				'alert-success': message.state == 'success'
			}"
			v-if="message.show"
		>
			{{ message.msg }}
		</div>
		<div class="choose-player-container section" v-if="myTurn && !entity.id">
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
				<tr v-for="y in game.fieldsize">
					<td
						v-bind:click="shoot(x - 1, y - 1)"
						v-if="getField(x - 1, y - 1)"
						v-for="x in game.fieldsize"
						v-bind:class="{
							hasShip: getField(x - 1, y - 1).ship,
							end: getField(x - 1, y - 1).end,
							start: getField(x - 1, y - 1).start,
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
			showCountdown: true,
			message: {
				show: false,
				msg: '',
				state: 'info'
			},
			myTurn: false,
			playerInTurn: {},
			otherPlayers: [],
			entity: {}
		};
	},
	async created() {
		// get gamCode for getting game
		const gameCode = this.$route.params.gameCode;
		try {
			GameService.getGame(gameCode).then(async game => {
				this.game = game;
				this.player = this.$store.state.player;

				// check user rights, states, etc.
				await this.startupCheck();

				this.fillFields();

				// start game (managed server-side)
				this.$socket.emit('startGame', {gameCode: this.game.gameCode});
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
			for (let x = 0; x < this.game.fieldsize; x++) {
				for (let y = 0; y < this.game.fieldsize; y++) {
					this.fields.push({
						x,
						y,
						ship: false
					});
				}
			}
		},
		shoot(x, y) {
			// TODO NEXT
		},
		entityChanged(entity) {
			this.entity = entity;

			// this.entity.ships.forEach(ship => {
			// 	let field = this.getField(ship.x, ship.y);
			// 	field.ship = true;
			// 	field.end = ship.end;
			// 	field.start = ship.start;
			// 	field.orientation = ship.orientation;
			// 	field.special = ship.special;
			// });

			console.log(this.fields);
			console.log(this.entity);
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
		}
	},
	sockets: {
		nextPlayer: function(data) {
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
