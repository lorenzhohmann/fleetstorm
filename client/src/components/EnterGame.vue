<template>
	<div>
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
				class="btn btn-success mr-1"
				v-bind:disabled="username == '' || gameCode == ''"
				v-on:click="enterGame(gameCode)"
			>
				<i class="fas fa-play mr-3"></i>Spiel beitreten
			</button>
			<button
				class="btn btn-primary"
				title="Spiele nachladen"
				v-on:click="reload()"
			>
				<i class="fas fa-sync-alt mr-3"></i>Refresh
			</button>
			<div class="alert alert-danger mt-3" v-if="error">{{ error }}</div>

			<div v-if="runningGames > 0">
				<h3 class="mt-10">Aus vorhandenen Spielen auswählen</h3>
				<div class="game-list row">
					<div
						class="col-sm-6 col-md-4"
						v-for="game in games"
						v-if="game.public && game.state === 0"
						v-bind:key="game.id"
					>
						<div class="card game-entry my-2">
							<div class="card-header">{{ game.gameCode }}</div>
							<div class="card-body">
								<h6
									class="card-subtitle mb-2 text-muted"
									v-if="!game.playerIDs.length"
								>
									<b>Admin:</b> Computer
								</h6>
								<p class="card-text">
									<b>Spieler:</b> [{{ game.playerIDs.length }}/{{
										game.maxPlayers
									}}]<br /><b>min. Spieleranzahl:</b> {{ game.minPlayers
									}}<br />
									<b>Feldgröße:</b> {{ game.fieldsize }}x{{ game.fieldsize
									}}<br />
									<b>Status: </b> {{ getStatus(game) }}
								</p>
								<button
									title="Spiel beitreten"
									v-bind:disabled="username == '' || game.state !== 0"
									v-on:click="enterGame(game.gameCode)"
									v-bind:class="{
										'btn-success': game.state === 0,
										'btn-secondary': game.state === 1,
										'btn-danger': game.state === 2
									}"
									class="btn"
								>
									<i class="fas fa-play"></i>
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
			games: [],
			runningGames: 0
		};
	},
	created() {
		this.getGames();
	},
	methods: {
		async getGames() {
			this.games = await GameService.getGames();
			this.runningGames = this.games.filter(game => game.public && game.state === 0).length;
		},
		getStatus(game) {
			switch (game.state) {
				case 0:
					return 'Warten...';
					break;
				case 1:
					return 'Schlacht läuft';
					break;
				case 2:
					return 'Beendet';
					break;
			}
		},
		async reload() {
			this.getGames();
		},
		async enterGame(gameCode) {
			// validate username
			if (!PlayerService.validateUsername(this.username)) {
				this.error =
					'Der Benutzername darf nur aus Ziffern, Großbuchstaben und Kleinbuchstaben bestehen und muss eine Länge zwischen drei und 16 Zeichen haben.';
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
			if (game.playerIDs.length >= game.maxPlayers) {
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
