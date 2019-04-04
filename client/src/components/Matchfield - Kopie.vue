<template>
	<div>
		<table class="matchfield">
			<tr v-for="y in game.fieldsize + 1">
				<!-- vertical headline -->
				<th v-for="x in game.fieldsize + 1" v-if="x == 1 && y > 1">
					{{ alphabet[y - 2] }}
				</th>

				<td
					v-model="index"
					v-on:click="clicked(x - 2, y - 2)"
					v-for="x in game.fieldsize + 1"
					v-if="y != 1 && x != 1"
				>
					{{ x - 2 }}|{{ y - 2 }}
				</td>

				<!-- horizontal headline -->
				<th v-for="x in game.fieldsize + 1" v-if="y == 1">
					{{ x - 1 }}
				</th>
			</tr>
		</table>
	</div>
</template>

<script>
export default {
	name: 'Matchfield',
	data() {
		return {
			fieldsize: 0,
			ships: [],
			shipPositions: [],
			field: [],
			alphabet: [
				'A',
				'B',
				'C',
				'D',
				'E',
				'F',
				'G',
				'H',
				'I',
				'J',
				'K',
				'L',
				'M',
				'N',
				'O',
				'P',
				'Q',
				'R',
				'S',
				'T',
				'U',
				'V',
				'W',
				'X',
				'Y',
				'Z'
			]
		};
	},
	props: ['game'],
	created() {
		this.fieldsize = this.game.fieldsize;

		this.ships.push({
			name: 'Ship 1',
			length: 3,
			color: 'red',
			orientation: 'horizontal'
		});

		this.ships.push({
			name: 'Ship 2',
			length: 4,
			color: 'blue',
			orientation: 'vertical'
		});

		this.positionShips();
	},
	methods: {
		clicked(x, y) {
			console.log(x, y);
		},
		positionShips() {
			this.ships.forEach(ship => {
				const x = parseInt(Math.random() * this.game.fieldsize + 1);
				const y = parseInt(Math.random() * this.game.fieldsize + 1);

				positionShip(x, y, ship.length, ship.orientation, ship.color);
			});
		},
		positionShip(x, y, length, orientation, color) {}
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
</style>
