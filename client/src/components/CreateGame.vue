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
	props: ['title'],
	data() {
		return {
			username: '',
			error: '',
			gameCode: ''
		};
	},
	methods: {
		async createGame() {
			// trim username and gameCode
			this.username = this.username.trim();
			this.gameCode = this.gameCode.trim();

			// validate username
			if (!PlayerService.validateUsername(this.username)) {
				this.error =
					'Der Benutzername darf nur aus Ziffern, Großbuchstaben und Kleinbuchstaben bestehen und muss eine Länge zwischen drei und zehn Zeichen haben.';
				return false;
			}

			// validate gameCode
			if (!GameService.validateGameCode(this.gameCode)) {
				this.error =
					'Der Spiel-Code darf nur aus Groß- und Kleinbuchstaben bestehen und muss zwischen 3 und zehn Zeichen haben.';
				return false;
			}

			// create game
			try {
				const game = await GameService.createGame(this.gameCode);
			} catch (err) {
				this.error = err.response.data.error;
				return false;
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
