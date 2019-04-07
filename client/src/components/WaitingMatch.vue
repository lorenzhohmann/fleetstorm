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
			ingamePlayers: []
		};
	},
	components: {
		Matchfield
	},
	created() {
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

				// TODO FIND ERROR get admin name
				this.getAdminName();

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
			});

			// update player list
			this.getPlayers();

			// update admin name
			this.getAdminName();
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
			PlayerService.deletePlayer(this.player.username);
			this.$store.dispatch('setPlayer', null);

			// update socket view
			this.$socket.emit('playerLeaveGame');

			// redirect to home
			this.$router.push({
				name: 'home',
				params: {
					error: 'Du hast das Spiel verlassen.'
				}
			});
		}
	}
};
</script>
