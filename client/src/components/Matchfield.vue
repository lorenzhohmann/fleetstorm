<template>
	<div>
		<table class="matchfield">
			<tr v-for="y in game.fieldsize">
				<td
					v-on:click="clicked(x - 1, y - 1)"
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

		<div class="matchfield-button-container mt-3 px-3" v-if="game.state == 0">
			<div class="row">
				<button
					v-bind:disabled="player.ready"
					class="btn btn-primary mr-3 btn-mobile-block col-12 col-md-4"
					v-on:click="positionShipsRandomly(player)"
				>
					<i class="fas fa-random mr-3"></i>Schiffe zufällig anordnen
				</button>
				<button
					class="btn btn-primary mr-3 col-12 col-md-2"
					title="Spieldaten aktualisieren"
					v-on:click="refreshData()"
				>
					<i class="fas fa-sync-alt mr-3"></i>Refresh
				</button>
				<button
					v-bind:disabled="player.ready"
					v-bind:class="{ pulse: !player.ready }"
					class="btn btn-success mr-1 btn-mobile-block animated infinite slower col-12 col-md-3"
					v-on:click="readyPlayer()"
				>
					<i class="fas fa-check mr-3"></i>Ich bin bereit!
				</button>
			</div>
			<div class="row mt-5">
				<button
					class="btn btn-secondary mr-5 btn-mobile-block col-12 col-md-3"
					v-on:click="leaveGame()"
				>
					<i class="fas fa-times mr-3"></i>Spiel verlassen
				</button>
			</div>
			<p class="small mt-2" v-if="player.ready">
				Das Spiel startet automatisch, sobald mehr als
				{{ game.minPlayers }} Spieler online sind und alle Spieler bereit sind.
			</p>
		</div>
	</div>
</template>

<script>
import GameService from '@/services/GameService.js';
import PlayerService from '@/services/PlayerService.js';

export default {
	name: 'Matchfield',
	data() {
		return {
			fields: [],
			ships: [],
			player: {},
			game: {
				playerIDs: []
			},
			gameCode: ''
		};
	},
	async created() {
		// get gameCode from store (set in Enter or Create Game)
		const gameCode = this.$route.params.gameCode;
		this.gameCode = gameCode;

		const player = this.$store.state.player;
		this.player = player;
		this.game = await GameService.getGame(gameCode);

		// create ships
		this.ships.push({
			id: 0,
			length: 3,
			special: '',
			orientation: 'x',
			end: false,
			start: false
		});
		this.ships.push({
			id: 1,
			length: 4,
			special: '',
			orientation: 'y',
			end: false,
			start: false
		});
		this.ships.push({
			id: 2,
			length: 5,
			special: '',
			orientation: 'y',
			end: false,
			start: false
		});
		this.ships.push({
			id: 3,
			length: 2,
			special: '',
			orientation: 'x',
			end: false,
			start: false
		});
		// this.ships.push({
		// 	id: 4,
		// 	length: 3,
		// 	special: 'side',
		// 	orientation: 'x',
		// 	end: false,
		// 	start: false
		// });

		for (let x = 0; x < this.game.fieldsize; x++) {
			for (let y = 0; y < this.game.fieldsize; y++) {
				this.fields.push({
					x,
					y,
					ship: false
				});
			}
		}

		this.positionShips();
	},
	sockets: {
		updateGameVars: function() {
			// update game
			const gameCode = this.$route.params.gameCode;
			GameService.getGame(gameCode).then(async game => {
				// refresh vue when fieldsize was changed
				if (this.game.fieldsize != game.fieldsize) {
					location.reload();
					return false;
				}

				this.game = game;
			});
		},
		redirectToPlayingArea: function(data) {
			if (this.game.gameCode == data.gameCode) {
				this.$router.push(`/match/${data.gameCode}/playing`);
			}
		}
	},
	methods: {
		leaveGame() {
			this.$emit('leave-game');
		},
		refreshData() {
			this.$socket.emit('updateGameVars');
		},
		positionShips() {
			// if user has already position ships
			if (this.player.ships.length) {
				this.player.ships.forEach(ship => {
					let field = this.getField(ship.x, ship.y);
					field.ship = true;
					field.end = ship.end;
					field.start = ship.start;
					field.orientation = ship.orientation;
					field.special = ship.special;
				});
			} else {
				this.positionShipsRandomly();
			}
		},
		async positionShipsRandomly() {
			// reset ship and field array
			this.fields.map(field => {
				field.ship = false;
				field.end = false;
				field.start = false;
				field.orientation = '';
				field.special = '';
			});
			this.player.ships = [];

			this.ships.forEach((ship, index) => {
				let shipSet = false;

				while (!shipSet) {
					let noShip = true;

					// create random coords
					const x = parseInt(Math.random() * this.game.fieldsize);
					const y = parseInt(Math.random() * this.game.fieldsize);
					let field = this.getField(x, y);

					ship.orientation = parseInt(Math.random() * 2) == 1 ? 'x' : 'y';

					// check if ship is set on positions
					for (let i = 0; i < ship.length; i++) {
						// if out of match area
						if (
							(ship.orientation == 'x' && x + i > 9) ||
							(ship.orientation == 'y' && y + i > 9)
						) {
							noShip = false;
							break;
						}

						// get field on calculated position
						let checkField;
						if (ship.orientation == 'x') {
							checkField = this.getField(x + i, y);
						} else {
							checkField = this.getField(x, y + i);
						}

						// break loop when ships coolidate
						if (checkField == undefined || checkField.ship) {
							noShip = false;
							break;
						}
					}

					// special ships
					switch (ship.special) {
						case 'side': // extra part on one side of the ship
							const specialField = this.getField(x + 1, y + 1);
							if (specialField == undefined || specialField.ship) {
								noShip = false;
								break;
							}
							break;
					}

					// set ship
					if (noShip) {
						shipSet = true;
						for (let i = 0; i < ship.length; i++) {
							let shipField;

							if (ship.orientation == 'x') {
								shipField = this.getField(x + i, y);
								shipField.ship = true;
								shipField.orientation = 'x';
							} else {
								shipField = this.getField(x, y + i);
								shipField.ship = true;
								shipField.orientation = 'y';
							}

							if (i == 0) {
								shipField.start = true;
							}
							if (i == ship.length - 1) {
								shipField.end = true;
							}

							this.player.ships.push({
								id: ship.id,
								length: ship.length,
								x: shipField.x,
								y: shipField.y,
								end: shipField.end,
								start: shipField.start,
								orientation: shipField.orientation,
								special: shipField.special
							});
						}

						// set special ships position
						switch (ship.special) {
							case 'side': // extra part on one side of the ship
								const specialField = this.getField(x + 1, y + 1);
								specialField.ship = true;
								specialField.orientation = ship.orientation == 'x' ? 'y' : 'x';
								specialField.end = true;

								this.player.ships.push({
									id: ship.id,
									length: ship.length,
									x: specialField.x,
									y: specialField.y,
									end: specialField.end,
									start: specialField.start,
									orientation: specialField.orientation,
									special: specialField.special
								});
								break;
						}
					}
				}
			});

			// update player instance
			this.player = await PlayerService.updatePlayer(this.player);
			this.$store.dispatch('setPlayer', this.player);
		},
		getField(x, y) {
			return this.fields.filter(f => f.x === x && f.y === y)[0];
		},
		async readyPlayer() {
			// set ready state
			this.player.ready = true;

			this.player = await PlayerService.updatePlayer(this.player);
			this.$store.dispatch('setPlayer', this.player);

			// fetch game var new
			this.game = await GameService.getGame(this.game.gameCode);

			// start game when all players ready
			// TODO get ready players
			let readyPlayers = 0;

			for (let i = 0; i < this.game.playerIDs.length; i++) {
				let pl = await PlayerService.getPlayer(this.game.playerIDs[i]);
				if (pl.ready) readyPlayers++;
			}

			const playerIDs = this.game.playerIDs;
			// if all players ready and bigger than minplayers
			if (
				readyPlayers >= this.game.minPlayers &&
				readyPlayers == this.game.playerIDs.length
			) {
				this.$socket.emit('redirectToPlayingArea', {
					gameCode: this.gameCode
				});
			}

			// update game
			this.$socket.emit('updateGameVars');
		}
	}
};
</script>
<style>
.matchfield-button-container {
	padding-bottom: 2rem;
}
</style>
