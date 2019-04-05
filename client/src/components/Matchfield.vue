<template>
	<div>
		<table class="matchfield">
			<tr v-for="y in game.fieldsize">
				<td
					v-on:click="clicked(x - 1, y - 1)"
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
			<div
				v-if="game.state == 0"
				class="btn btn-danger mr-5"
				v-on:click="leaveGame()"
			>
				Spiel verlassen
			</div>
			<div
				v-if="game.state == 0"
				class="btn btn-primary mr-1"
				v-on:click="positionShipsRandomly(player)"
			>
				Schiffe zufällig anordnen
			</div>
			<div
				v-if="game.state == 0"
				v-bind:disabled="player.ready"
				class="btn btn-success mr-1"
				v-on:click="readyPlayer()"
			>
				Ich bin bereit!
			</div>
		</div>
	</div>
</template>

<script>
import PlayerService from '@/services/PlayerService.js';

export default {
	name: 'Matchfield',
	data() {
		return {
			fields: [],
			ships: []
		};
	},
	props: ['game', 'player'],
	created() {
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

		this.positionShips(this.player);
	},
	methods: {
		leaveGame() {
			this.$emit('leave-game');
		},
		async positionShips(player) {
			// if user has already set ships
			if (player.ships.length) {
				this.player.ships.forEach(ship => {
					let field = this.getField(ship.x, ship.y);
					field.ship = true;
					field.color = ship.color;
					field.end = ship.end;
					field.start = ship.start;
					field.orientation = ship.orientation;
				});
			} else {
				this.positionShipsRandomly(player);
			}
		},
		async positionShipsRandomly(player) {
			// if ships not set

			// reset ship and field array
			this.fields.map(field => {
				field.ship = false;
				field.color = '';
				field.end = false;
				field.start = false;
				field.orientation = '';
			});
			player.ships = [];

			this.ships.forEach((ship, index) => {
				let shipSet = false;

				while (!shipSet) {
					let noShip = true;

					// create random coords
					const x = parseInt(Math.random() * this.game.fieldsize);
					const y = parseInt(Math.random() * this.game.fieldsize);
					let field = this.getField(x, y);

					ship.orientation =
						parseInt(Math.random() * 2) == 1 ? 'x' : 'y';

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

							player.ships.push({
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
			player = await PlayerService.updatePlayer(player);
			this.$store.dispatch('setPlayer', player);
		},
		getField(x, y) {
			return this.fields.filter(f => f.x === x && f.y === y)[0];
		},
		getColor(x, y) {
			return this.getField(x, y).color;
		},
		clicked(x, y) {},
		readyPlayer() {
			this.player.ready = true;
			alert('player ready');

			// start game when all players ready
			const readyPlayers = this.game.players.filter(p => p.ready).length;
			if (readyPlayers == this.game.maxPlayers) {
				alert('START GAME');
			}
		}
	}
};
</script>
<style>
.matchfield {
	padding: 1rem;
	width: 600px;
	height: 600px;
	table-layout: fixed;
	margin: 0 auto;

	background-image: url(../../public/img/matchfield-background.jpg);
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
}
.matchfield td,
.matchfield th {
	border: 1px solid rgba(255, 255, 255, 0.2);
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
.matchfield td.x {
	border: none;
}
.matchfield td.start.x {
	border-top-left-radius: 40%;
	border-bottom-left-radius: 40%;
}
.matchfield td.end.x {
	border-top-right-radius: 40%;
	border-bottom-right-radius: 40%;
}
.matchfield td.start.y {
	border-top-left-radius: 40%;
	border-top-right-radius: 40%;
}
.matchfield td.end.y {
	border-bottom-left-radius: 40%;
	border-bottom-right-radius: 40%;
}
</style>
