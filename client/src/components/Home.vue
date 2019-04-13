<template>
	<div>
		<h1 class="main-headline homescreen">
			Battleship
		</h1>
		<div class="button-container px-5">
			<router-link class="btn btn-success btn-block btn-lg" to="game/create"
				><i class="fas fa-plus mr-3"></i>Spiel erstellen</router-link
			>
			<router-link class="btn btn-primary btn-block btn-lg" to="game/enter"
				><i class="fas fa-play mr-3"></i>Spiel beitreten<span
					class="ml-1 badge badge-secondary"
					v-if="runningGames > 0"
					>{{ runningGames }}</span
				></router-link
			>
			<router-link class="btn btn-dark btn-block btn-lg mt-5" to="imprint"
				><i class="fas fa-info mr-3"></i>Impressum</router-link
			>
			<router-link class="btn btn-dark btn-block btn-lg" to="privacy"
				><i class="fas fa-shield-alt mr-3"></i>Datenschutz</router-link
			>
			<div class="alert alert-info mt-5" v-if="error">{{ error }}</div>
		</div>
	</div>
</template>

<script>
import GameService from '@/services/GameService.js';

export default {
	name: 'home',
	data() {
		return {
			runningGames: 0,
			error: ''
		};
	},
	created() {
		this.error = this.$route.params.error;

		this.loadRunningGames();
	},
	methods: {
		async loadRunningGames() {
			const games = await GameService.getGames();
			this.runningGames = games.length;
		}
	}
};
</script>
