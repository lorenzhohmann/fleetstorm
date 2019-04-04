<template>
	<div>
		<table class="matchfield">
			<tr v-for="y in game.fieldsize">
				<td
					v-on:click="clicked(x - 1, y - 1)"
					v-for="x in game.fieldsize"
					v-bind:class="{
						hasShip: getField(x - 1, y - 1).ship,
						red: getField(x - 1, y - 1).color == 'red',
						blue: getField(x - 1, y - 1).color == 'blue',
						green: getField(x - 1, y - 1).color == 'green',
						orange: getField(x - 1, y - 1).color == 'orange'
					}"
				>
					{{ x - 1 }}|{{ y - 1 }}
				</td>
			</tr>
		</table>
	</div>
</template>

<script>
export default {
	name: 'Matchfield',
	data() {
		return {
			fields: [],
			ships: []
		};
	},
	props: ['game'],
	created() {
		// create ships
		this.ships.push({
			length: 3,
			orientation: 'x',
			color: 'blue'
		});
		this.ships.push({
			length: 4,
			orientation: 'y',
			color: 'red'
		});
		this.ships.push({
			length: 5,
			orientation: 'y',
			color: 'green'
		});
		this.ships.push({
			length: 2,
			orientation: 'x',
			color: 'orange'
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

		this.positionShipsRandomly();
	},
	methods: {
		positionShipsRandomly() {
			this.ships.forEach((ship, index) => {
				let shipSet = false;

				while (!shipSet) {
					let noShip = true;

					// create random coords
					const x = parseInt(Math.random() * this.game.fieldsize);
					const y = parseInt(Math.random() * this.game.fieldsize);
					let field = this.getField(x, y);

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
							let field;
							if (ship.orientation == 'x') {
								const shipField = this.getField(x + i, y);
								shipField.ship = true;
								shipField.color = ship.color;
							} else {
								const shipField = this.getField(x, y + i);
								shipField.ship = true;
								shipField.color = ship.color;
							}
						}
					}
				}
			});
		},
		getField(x, y) {
			return this.fields.filter(f => f.x === x && f.y === y)[0];
		},
		getColor(x, y) {
			return this.getField(x, y).color;
		},
		clicked(x, y) {}
	}
};
</script>
<style>
.matchfield {
	padding: 1rem;
	width: 80%;
	table-layout: fixed;
	margin: 0 auto;
}
.matchfield td,
.matchfield th {
	border: 1px solid #000;
	text-align: center;
}
.matchfield th {
	font-size: 40px;
	background-color: #08628a;
	color: #fff;
}
.matchfield tr {
	height: 4rem;
}
.matchfield td.blue {
	background: blue;
}
.matchfield td.green {
	background: green;
}
.matchfield td.red {
	background: red;
}
.matchfield td.orange {
	background: orange;
}
</style>
