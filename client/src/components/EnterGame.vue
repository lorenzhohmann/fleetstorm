<template>
	<div>
		<h2>Spiel beitreten</h2>

		<div class="content-container">
			<h3>Über Spiel-Code beitreten</h3>
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
				class="btn btn-success btn-block btn-lg"
				v-bind:disabled="username == '' || gameCode == ''"
				v-on:click="enterGame(gameCode)"
			>
				Spiel beitreten
			</button>
			<div class="alert alert-danger mt-3" v-if="error">{{ error }}</div>

			<div v-if="games.length">
				<h3 class="mt-10">Aus vorhandenen Spielen auswählen</h3>
				<div class="game-list row">
					<div class="col-sm-6 col-md-4" v-for="game in games">
						<div class="card game-entry my-2">
							<div class="card-header">{{ game.gameCode }}</div>
							<div class="card-body">
								<h6
									class="card-subtitle mb-2 text-muted"
									v-if="game.players.length"
								>
									<b>Admin:</b> {{ game.players[0].username }}
								</h6>
								<h6
									class="card-subtitle mb-2 text-muted"
									v-if="!game.players.length"
								>
									<b>Admin:</b> Computer
								</h6>
								<p class="card-text">
									<b>Aktuelle Spieleranzahl:</b> [{{
										game.players.length
									}}/{{ game.maxPlayers }}]<br />
									<b>Spielfeld:</b> {{ game.fieldsize }}x{{
										game.fieldsize
									}}
								</p>
								<button
									v-bind:disabled="username == ''"
									v-on:click="enterGame(game.gameCode)"
									class="btn btn-success"
								>
									Spiel beitreten
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import PlayerService from '@/services/PlayerService.js';
import GameService from '@/services/GameService.js';

export default {
	name: 'EnterGame',
	data() {
		return {
			gameCode: '',
			username: '',
			error: '',
			games: []
		};
	},
	mounted() {
		this.getGames();
	},
	methods: {
		getGames() {
			GameService.getGames().then(games => (this.games = games.data));
		},
		async enterGame(gameCode) {
			// validate username
			if (!PlayerService.validateUsername(this.username)) {
				this.error =
					'Der Benutzername darf nur aus Ziffern, Großbuchstaben und Kleinbuchstaben bestehen und muss eine Länge zwischen drei und zehn Zeichen haben.';
				return;
			}

			let game;

			// check if gameCode exists
			try {
				game = await GameService.getGame(gameCode).then();
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

				this.$router.push('/match/' + gameCode + '/waiting');
			} catch (err) {
				this.error = err.response.data.error;
			}
		}
	}
};
</script>
