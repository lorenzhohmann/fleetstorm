<template>
	<div>
		<div class="content-container">
			<div class="form-row">
				<div class="form-group col-md-6 col-sm-12">
					<input
						type="text"
						class="form-control"
						placeholder="Benutzername"
						v-model="username"
					/>
				</div>
				<div class="form-group col-md-6 col-sm-12">
					<input
						type="text"
						class="form-control"
						placeholder="Spiel-Code"
						v-model="gameCode"
					/>
				</div>
			</div>
			<button
				class="btn btn-success"
				v-bind:disabled="username == '' || gameCode == ''"
				v-on:click="createGame()"
			>
				<i class="fas fa-plus mr-3"></i>Spiel erstellen
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
			// TODO check if gameCode already exists

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
