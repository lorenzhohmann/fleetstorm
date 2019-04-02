<template>
	<div>
		<h3>Schiffe positionieren</h3>
		<table class="matchfield">
			<tr v-for="y in game.fieldsize + 1">
				<!-- vertical headline -->
				<th v-for="x in game.fieldsize + 1" v-if="x == 1 && y > 1">
					{{ alphabet[y - 2] }}
				</th>

				<td v-for="x in game.fieldsize + 1" v-if="y != 1 && x != 1">
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
