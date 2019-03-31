<template>
	<div>
		<div class="match-area"></div>
	</div>
</template>

<script>
export default {
	name: 'home',
	data() {
		return {
			socket: null
		};
	},
	created() {
		socket = io();
		console.log(socket);
	}
};
</script>
