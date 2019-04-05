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
						'color-1': getField(x - 1, y - 1).color == 'color-1',
						'color-2': getField(x - 1, y - 1).color == 'color-2',
						'color-3': getField(x - 1, y - 1).color == 'color-3',
						'color-4': getField(x - 1, y - 1).color == 'color-4',
						end: getField(x - 1, y - 1).end,
						start: getField(x - 1, y - 1).start,
						x: getField(x - 1, y - 1).orientation == 'x',
						y: getField(x - 1, y - 1).orientation == 'y'
					}"
				></td>
			</tr>
		</table>

		<div class="matchfield-button-container mt-3" v-if="game.state == 0">
			<button
				v-if="game.state == 0"
				class="btn btn-danger mr-5"
				v-on:click="leaveGame()"
			>
				<i class="fas fa-times mr-3"></i>Spiel verlassen
			</button>
			<button
				v-if="game.state == 0"
				v-bind:disabled="player.ready && false"
				class="btn btn-success mr-1 float-right animated infinite pulse slower"
				v-on:click="readyPlayer()"
			>
				<i class="fas fa-check mr-3"></i>Ich bin bereit!
			</button>
			<button
				v-if="game.state == 0"
				class="btn btn-primary mr-1 float-right"
				v-on:click="positionShipsRandomly(player)"
			>
				<i class="fas fa-random mr-3"></i>Schiffe zufällig anordnen
			</button>
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
			}
		};
	},
	async created() {
		// get gameCode from store (set in Enter or Create Game)
		const gameCode = this.$route.params.gameCode;

		const player = this.$store.state.player;
		this.player = player;
		this.game = await GameService.getGame(gameCode);

		// create ships
		this.ships.push({
			length: 3,
			orientation: 'x',
			color: 'color-1',
			end: false,
			start: false
		});
		this.ships.push({
			length: 4,
			orientation: 'y',
			color: 'color-2',
			end: false,
			start: false
		});
		this.ships.push({
			length: 5,
			orientation: 'y',
			color: 'color-3',
			end: false,
			start: false
		});
		this.ships.push({
			length: 2,
			orientation: 'x',
			color: 'color-4',
			end: false,
			start: false
		});

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
	methods: {
		leaveGame() {
			this.$emit('leave-game');
		},
		async positionShips() {
			// if user has already position ships
			if (this.player.ships.length) {
				this.player.ships.forEach(ship => {
					let field = this.getField(ship.x, ship.y);
					field.ship = true;
					field.color = ship.color;
					field.end = ship.end;
					field.start = ship.start;
					field.orientation = ship.orientation;
				});
			} else {
				this.positionShipsRandomly();
			}
		},
		async positionShipsRandomly() {
			// reset ship and field array
			this.fields.map(field => {
				field.ship = false;
				field.color = '';
				field.end = false;
				field.start = false;
				field.orientation = '';
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
						if (checkField.ship) {
							noShip = false;
							break;
						}
					}

					// set ship
					if (noShip) {
						shipSet = true;
						for (let i = 0; i < ship.length; i++) {
							let shipField;

							if (ship.orientation == 'x') {
								shipField = this.getField(x + i, y);
								shipField.ship = true;
								shipField.color = ship.color;
								shipField.orientation = 'x';
							} else {
								shipField = this.getField(x, y + i);
								shipField.ship = true;
								shipField.color = ship.color;
								shipField.orientation = 'y';
							}

							if (i == 0) {
								shipField.start = true;
							}
							if (i == ship.length - 1) {
								shipField.end = true;
							}

							this.player.ships.push({
								x: shipField.x,
								y: shipField.y,
								end: shipField.end,
								start: shipField.start,
								orientation: shipField.orientation,
								color: shipField.color
							});
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
		getColor(x, y) {
			return this.getField(x, y).color;
		},
		clicked(x, y) {},
		async readyPlayer() {
			// set ready state
			const player = this.game.players.filter(p => p.id === this.player.id)[0];
			player.ready = true;

			// TODO start game when all players ready

			// set global player
			this.player = player;

			this.game = await GameService.updateGame(this.game);

			// TODO check if needed
			this.$store.dispatch('setPlayer', this.player);

			// update game
			this.$socket.emit('updateGameVars');
		}
	}
};
</script>
<style>
.matchfield {
	border-radius: 10px;
	padding: 1rem;
	width: 600px;
	height: 600px;
	table-layout: fixed;
	margin: 0 auto;

	background-color: rgba(8, 98, 138, 0.8);
	background-image: url(../../public/img/matchfield-background.jpg);
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
}
.matchfield td,
.matchfield th {
	border: 1px solid rgba(255, 255, 255, 0.1);
	text-align: center;
}
.matchfield th {
	font-size: 40px;
	background-color: #08628a;
	color: #fff;
}
.matchfield tr {
	height: 3rem;
}
.matchfield td {
	opacity: 0.9;
}
.matchfield td.color-1 {
	background: #b7b2b2;
}
.matchfield td.color-2 {
	background: #6e6e6e;
}
.matchfield td.color-3 {
	background: #464646;
}
.matchfield td.color-4 {
	background: #999999;
}
.matchfield td.x,
.matchfield td.y {
	border: none;
}
.matchfield td.hasShip {
	background-image: url(../../public/img/ship.png);
	background-color: transparent;
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
}
.matchfield td.y {
	transform: rotate(90deg);
}
.matchfield td.start.x {
	background-position: left center;
}
.matchfield td.end.x {
	background-position: left center;
	transform: rotate(180deg);
}
.matchfield td.start.y {
	background-position: left center;
	transform: rotate(90deg);
}
.matchfield td.end.y {
	background-position: left center;
	transform: rotate(270deg);
}
</style>
