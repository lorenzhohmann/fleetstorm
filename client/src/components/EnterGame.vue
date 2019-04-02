<template>
	<div>
		<h2>Spiel beitreten</h2>

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
				v-on:click="enterGame()"
			>
				Spiel beitreten
			</button>
			<div class="alert alert-danger mt-3" v-if="error">{{ error }}</div>
		</div>
	</div>
</template>

<script>
import PlayerService from '@/services/PlayerService.js';
import GameService from '@/services/GameService.js';

export default {
	name: 'CreateGame',
	data() {
		return {
			gameCode: '',
			username: '',
			error: ''
		};
	},
	methods: {
		async enterGame() {
			// validate username
			if (!PlayerService.validateUsername(this.username)) {
				this.error =
					'Der Benutzername darf nur aus Ziffern, Großbuchstaben und Kleinbuchstaben bestehen und muss eine Länge zwischen drei und zehn Zeichen haben.';
				return;
			}

			let game;

			// check if gameCode exists
			try {
				game = await GameService.getGame(this.gameCode);
			} catch (err) {
				this.error = err.response.data.error;
				return;
			}

			// if game is full
			if (game.players.length >= game.maxPlayers) {
				this.error = 'Die maximale Spieleranzahl ist bereits erreicht.';
				return;
			}

			// create user, add to game and redirect
			try {
				const player = await PlayerService.createPlayer(this.username);
				this.$store.dispatch('setPlayer', player);

				this.$router.push('/match/' + this.gameCode + '/waiting');
			} catch (err) {
				this.error = err.response.data.error;
			}
		}
	}
};
</script>
