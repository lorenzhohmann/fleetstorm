<template>
	<div class="button-container">
		<router-link class="btn btn-primary btn-block btn-lg" to="game/create"
			>Spiel starten</router-link
		>
		<router-link class="btn btn-primary btn-block btn-lg" to="game/enter"
			>Spiel beitreten</router-link
		>
		<div class="alert alert-info mt-5" v-if="error">{{ error }}</div>
	</div>
</template>

<script>
export default {
	name: 'home',
	data() {
		return {
			error: ''
		};
	},
	created() {
		this.error = this.$route.params.error;
	}
};
</script>
