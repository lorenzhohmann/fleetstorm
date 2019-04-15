<template>
	<div class="ship-info-container mb-3">
		<p v-if="player.id === entity.id">Deine eigene Flotte</p>
		<p v-if="player.id !== entity.id">Flotte von {{ entity.username }}</p>

		<div
			class="ship"
			v-bind:class="{
				completed: sunkShips.filter(s => s.length === 2).length
			}"
		>
			<div></div>
			<div></div>
		</div>

		<div
			class="ship"
			v-bind:class="{
				completed: sunkShips.filter(s => s.length === 3).length
			}"
		>
			<div></div>
			<div></div>
			<div></div>
		</div>

		<div
			class="ship"
			v-bind:class="{
				completed: sunkShips.filter(s => s.length === 4).length
			}"
		>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>

		<div
			class="ship"
			v-bind:class="{
				completed: sunkShips.filter(s => s.length === 5).length
			}"
		>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ShipInfoComponent',
	props: ['sunkShips', 'player', 'entity']
};
</script>
