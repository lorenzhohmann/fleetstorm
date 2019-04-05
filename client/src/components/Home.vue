<template>
	<div class="button-container px-5">
		<router-link class="btn btn-primary btn-block btn-lg" to="game/create"
			><i class="fas fa-plus mr-3"></i>Spiel erstellen</router-link
		>
		<router-link class="btn btn-primary btn-block btn-lg" to="game/enter"
			><i class="fas fa-play mr-3"></i>Spiel beitreten</router-link
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
