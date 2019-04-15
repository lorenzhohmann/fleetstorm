<template>
	<div class="ship-info-container mb-3">
		<p>
			Flotte von <b>{{ player.username }}</b>
		</p>
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
import GameService from '@/services/GameService.js';
import PlayerService from '@/services/PlayerService.js';

export default {
	name: 'ShipInfoComponent',
	props: ['player', 'sunkShips']
};
</script>
