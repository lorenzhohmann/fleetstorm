<template>
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
		</tr></table
></template>

<script>
export default {
	name: 'ShipInfoComponent',
	props: ['game', 'allowShoot'],
	methods: {
		getField(x, y) {
			return this.$parent.getField(x, y);
		},
		shoot(x, y) {
			if (!this.allowShoot) return false; // disable shoot for player not in turn
			return this.$parent.shoot(x, y);
		}
	}
};
</script>
