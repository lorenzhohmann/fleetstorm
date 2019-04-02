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
			// validate username
			if (!PlayerService.validateUsername(this.username)) {
				this.error =
					'Der Benutzername darf nur aus Ziffern, Großbuchstaben und Kleinbuchstaben bestehen und muss eine Länge zwischen drei und zehn Zeichen haben.';
				return;
			}

			// create game
			try {
				const game = await GameService.createGame(this.gameCode);
			} catch (err) {
				this.error = err.response.data.error;
				return;
			}

			// create player and redirect to waiting area
			try {
				const player = await PlayerService.createPlayer(this.username);
				this.$store.dispatch('setPlayer', player);

				this.$router.push('/match/' + this.gameCode + '/waiting');
			} catch (err) {
				GameService.deleteGame(this.gameCode);
				this.error = err.response.data.error;
			}
		}
	}
};
</script>
