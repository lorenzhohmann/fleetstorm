<template>
	<div>
		<h2>Spiel erstellen</h2>

		<div class="content-container">
			<div class="row form-group">
				<div class="col">
					<input
						type="text"
						class="form-control"
						placeholder="Benutzername"
						v-model="username"
					/>
				</div>
				<div class="col">
					<input
						type="text"
						class="form-control"
						placeholder="Spiel-Code"
						v-model="gameCode"
					/>
				</div>
			</div>
			<button
				class="btn btn-success btn-block btn-lg"
				v-if="username != '' && gameCode != ''"
				v-on:click="createGame()"
			>
				Spiel erstellen
			</button>
			<div class="alert alert-danger mt-3" v-if="error">{{ error }}</div>
		</div>
	</div>
</template>

<script>
import GameService from '@/services/GameService.js';
import PlayerService from '@/services/PlayerService.js';

export default {
	name: 'CreateGame',
	data() {
		return {
			username: '',
			error: '',
			gameCode: ''
		};
	},
	methods: {
		async createGame() {
			try {
				const result = await GameService.createGame(this.gameCode);
				this.addPlayerToGame(result.gameCode, this.username);
			} catch (err) {
				this.error = err.response.data.error;
			}
		},
		async addPlayerToGame(gameCode, username) {
			this.error = '';

			let player, game;

			// create player
			try {
				player = await PlayerService.createPlayer(username);
			} catch (err) {
				this.error = err.response.data.error;
				GameServer.deleteGame(gameCode);
				return;
			}

			// add player to game
			try {
				game = await GameService.addPlayerToGame(gameCode, player);
			} catch (err) {
				this.error = err.response.data.error;
				GameService.deleteGame(gameCode);
				PlayerService.deletePlayer(player.id);
				return;
			}

			// set store vars
			this.$store.dispatch('setGame', game);
			this.$store.dispatch('setPlayer', player);

			// redirect to match waiting area
			this.$router.push('/match');
		}
	}
};
</script>
