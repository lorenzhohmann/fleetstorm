<template>
	<div>
		<div class="match-area">
			<div class="info-container section">
				<h3>Spielinfos</h3>
				<p><b>Dein Name:</b> {{ player.username }}</p>
				<p v-if="game.playerIDs.length">
					<b>Aktuelle Spieleranzahl: </b>[{{ game.playerIDs.length }}/{{
						game.maxPlayers
					}}]
				</p>
				<p><b>minimale Spieleranzahl:</b> {{ game.minPlayers }}</p>
				<p><b>Feldgröße: </b>{{ game.fieldsize }}x{{ game.fieldsize }}</p>
				<p v-if="game.playerIDs.length"><b>Spielleiter: </b>{{ adminName }}</p>
				<p v-if="game.playerIDs.length"><b>Spieler: </b>{{ ingamePlayers }}</p>

				<div class="setting-area" v-if="game.playerIDs[0] == player.id">
					<h3>Einstellungen (Spielleitung)</h3>
					<div class="form-row">
						<div class="col-12 col-md-4 mb-3">
							<label for="minPlayers"
								>Minimale Spieleranzahl: {{ minPlayers }}</label
							>
							<input
								type="range"
								class="custom-range"
								min="2"
								id="minPlayers"
								v-model="minPlayers"
								v-bind:max="maxPlayers"
								v-on:change="changeGameSetting()"
							/>
						</div>
						<div class="col-12 col-md-4 mb-3">
							<label for="maxPlayers"
								>Maximale Spieleranzahl: {{ maxPlayers }}</label
							>
							<input
								type="range"
								class="custom-range"
								max="24"
								id="maxPlayers"
								v-model="maxPlayers"
								v-bind:min="minPlayers"
								v-on:change="changeGameSetting()"
							/>
						</div>
						<div class="col-12 col-md-4 mb-3">
							<label for="maxPlayers">Feldgröße: {{ fieldsize }}</label>
							<input
								type="range"
								class="custom-range"
								min="6"
								max="12"
								step="2"
								id="fieldsize"
								v-model="fieldsize"
								v-on:change="changeGameSetting()"
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="section">
				<h3>Strategie vorbereiten</h3>
				<Matchfield v-on:leave-game="leaveGame()" />
			</div>
		</div>
	</div>
</template>

<script>
import GameService from '@/services/GameService.js';
import PlayerService from '@/services/PlayerService.js';
import Matchfield from '@/components/Matchfield.vue';

export default {
	name: 'WaitingMatch',
	data() {
		return {
			adminName: '',
			game: {
				playerIDs: []
			},
			player: {},
			ingamePlayers: [],
			minPlayers: 0,
			maxPlayers: 0,
			fieldsize: 0
		};
	},
	components: {
		Matchfield
	},
	async created() {
		// get gameCode from store (set in Enter or Create Game)
		const gameCode = this.$route.params.gameCode;

		this.player = this.$store.state.player;

		// search for game
		GameService.getGame(gameCode)
			.then(async game => {
				// redirect user to enter area if no player is set
				if (!this.player) {
					this.$router.push({
						path: '/game/enter'
					});
					return;
				}

				// if game is full
				if (
					!GameService.playerIsInGame(this.player, game) &&
					game.playerIDs.length >= game.maxPlayers
				) {
					this.$router.push({
						name: 'home',
						params: {
							error: 'Die maximale Spieleranzahl ist bereits erreicht.'
						}
					});
					return;
				}

				// if game state not waiting
				if (game.state != 0) {
					this.$router.push({
						name: 'home',
						params: {
							error: 'Das Spiel hat bereits begonnen.'
						}
					});
					return;
				}

				// add player if not in game
				if (!GameService.playerIsInGame(this.player, game)) {
					game = await GameService.addPlayerToGame(
						game.gameCode,
						this.player.id
					);
				}

				// add socket event for user joining
				this.$socket.emit('playerJoinGame');

				// set game global for this component
				this.game = game;

				// get players
				this.getPlayers();

				// get admin name
				this.getAdminName();

				// set setting vars
				this.minPlayers = this.game.minPlayers;
				this.maxPlayers = this.game.maxPlayers;
				this.fieldsize = this.game.fieldsize;

				return;
			})
			.catch(err => {
				// no game found => push to home
				this.$router.push({
					name: 'home',
					params: {
						error: 'Das angeforderte Spiel existiert nicht.'
					}
				});
				return;
			});
	},
	sockets: {
		updateGameVars: function() {
			// update game
			const gameCode = this.$route.params.gameCode;
			GameService.getGame(gameCode).then(async game => {
				this.game = game;

				// update player list
				this.getPlayers();

				// update admin name
				this.getAdminName();
			});
		}
	},
	methods: {
		async getPlayers() {
			let playerString = '';
			const players = await PlayerService.getPlayers();
			const playerIDs = this.game.playerIDs;

			for (let i = 0; i < playerIDs.length; i++) {
				let player = players.filter(p => p.id === playerIDs[i])[0];

				playerString += player.username;

				playerString += player.ready ? ' (bereit)' : ' (nicht bereit)';

				playerString += i + 1 === playerIDs.length ? '' : ', ';
			}

			this.ingamePlayers = playerString;
		},
		async getAdminName() {
			const admin = await PlayerService.getPlayer(this.game.playerIDs[0]);
			this.adminName = admin.username;
		},
		leaveGame() {
			// TODO check function

			// remove player from game
			GameService.removePlayer(this.game.gameCode, this.player.id);

			// delete player
			PlayerService.deletePlayer(this.player.id);
			this.$store.dispatch('setPlayer', null);

			// update socket view
			this.$socket.emit('playerLeaveGame');

			// redirect to home
			this.$router.push({
				name: 'home',
				params: {
					// error: 'Du hast das Spiel verlassen.'
				}
			});
		},
		async changeGameSetting() {
			// validate
			if (this.minPlayers < 2) {
				this.minPlayers = 2;
				return false;
			}

			// get game to avoid update error
			this.game = await GameService.getGame(this.game.gameCode);

			// reset ships and ready state when fieldsize is changed
			if (this.game.fieldsize != this.fieldsize) {
				for (let i = 0; i < this.game.playerIDs.length; i++) {
					let pl = await PlayerService.getPlayer(this.game.playerIDs[i]);
					pl.ready = false;
					pl.ships = [];
					PlayerService.updatePlayer(pl);
				}
			}

			// set new vars
			this.game.minPlayers = parseInt(this.minPlayers);
			this.game.maxPlayers = parseInt(this.maxPlayers);
			this.game.fieldsize = parseInt(this.fieldsize);

			// update game
			this.game = await GameService.updateGame(this.game);

			// update game for other players
			this.$socket.emit('updateGameVars');
		}
	}
};
</script>
