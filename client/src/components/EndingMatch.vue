<template>
	<div>
		<h1 class="text-center mt-5">
			Die Schlacht ist vorbei!<br />Der Gewinner steht fest..
		</h1>
		<h5 class="text-center text-primary winner my-4">{{ winner.username }}</h5>
		<h1 class="text-center">Herzlichen Glückwunsch!</h1>
		<button
			class="btn btn-success btn-block btn-lg mt-5"
			v-on:click="toHomescreen()"
		>
			<i class="fas fa-home mr-3"></i>Zum Homescreen
		</button>
	</div>
</template>

<script>
import GameService from "@/services/GameService.js";
import PlayerService from "@/services/PlayerService.js";

export default {
	name: "EndingMatch",
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
			GameService.getGame(gameCode)
				.then(game => {
					this.game = game;
					this.player = this.$store.state.player;

					if (!this.game || !this.player) {
						this.$router.push({
							name: "start"
						});
						return false;
					}

					// if game not in ending state
					if (this.game.state !== 2) {
						this.$router.push("/start");
						return false;
					}

					// get winner
					this.winner = this.game.winner;

					// delete player
					PlayerService.deletePlayer(this.player.id);
					this.$store.dispatch("setPlayer", null);
					return false;
				})
				.catch(err => {
					this.$router.push({
						name: "start"
					});
					return false;
				});
		} catch (err) {
			this.$router.push({
				name: "start",
				params: {
					error: "Sorry, da ist etwas schief gelaufen.. (Fehlercode: #EM)"
				}
			});
			return false;
		}
	},
	methods: {
		toHomescreen() {
			// delete game when exists
			try {
				GameService.getGame(this.game.gameCode).then(game => {
					GameService.deleteGame(game.gameCode);
				});
			} catch (err) {}

			// push to homescreen
			this.$router.push("/start");
		}
	}
};
</script>
<style>
h5.winner {
	font-weight: bold;
	font-size: 12rem;
}
</style>
