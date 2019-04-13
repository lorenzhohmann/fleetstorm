<template>
	<div>
		<h1 class="text-center mt-5">
			Die Schlacht ist vorbei!<br />Der Gewinner steht fest..
		</h1>
		<h5 class="text-center text-primary winner my-4">{{ winner.username }}</h5>
		<h1 class="text-center">Herzlichen Glückwunsch!</h1>
		<router-link class="btn btn-success btn-block btn-lg" to="/"
			><i class="fas fa-home mr-3"></i>Zum Homescreen</router-link
		>
	</div>
</template>

<script>
import GameService from '@/services/GameService.js';
import PlayerService from '@/services/PlayerService.js';

export default {
	name: 'EndingMatch',
	data() {
		return {
			game: {
				playerIDs: []
			},
			player: {},
			winner: {}
		};
	},
	async created() {
		// get gameCode for getting game
		const gameCode = this.$route.params.gameCode;
		this.gameCode = gameCode;
		try {
			GameService.getGame(gameCode).then(game => {
				this.game = game;
				this.player = this.$store.state.player;

				if (!this.game || !this.player) {
					this.$router.push({
						name: 'home',
						params: {
							error: 'Der Krieg ist vorbei!'
						}
					});
				}

				// if game not in ending state
				if (this.game.state !== 2) {
					this.$router.push('/');
					return false;
				}

				// get winner
				this.winner = this.game.winner;

				// delete player
				PlayerService.deletePlayer(this.player.username);
				this.$store.dispatch('setPlayer', null);

				// delete game
				GameService.deleteGame(this.game.gameCode);
			});
		} catch (err) {
			this.$router.push({
				name: 'home',
				params: {
					error: 'Sorry, da ist etwas schief gelaufen.. (Fehlercode: #EM)'
				}
			});
		}
	}
};
</script>
<style>
h5.winner {
	font-family: 'Germania One', cursive;
	font-size: 12rem;
}
</style>
