<template>
	<div>
		<h2>Match-Vorbereitungen</h2>
		<div class="match-area">
			<div class="info-container">
				<h3>Spielinfos</h3>
				<p>
					<b>Aktuelle Spieleranzahl: </b>[{{ game.players.length }}/{{
						game.maxPlayers
					}}]
				</p>
				<p><b>Feldgröße: </b>{{ game.fieldsize }}x{{ game.fieldsize }}</p>
				<p><b>Admin: </b>{{ game.players[0].username }}</p>
				<p v-if="game.team1.length">
					<b>Team 1: </b>{{ concatUsernames(game.team1) }}
				</p>
				<p v-if="game.team2.length">
					<b>Team 2: </b>{{ concatUsernames(game.team2) }}
				</p>
			</div>
			<Matchfield v-bind:game="game" />
		</div>
	</div>
</template>

<script>
import GameService from '@/services/GameService.js';
import Matchfield from '@/components/Matchfield.vue';

export default {
	name: 'WaitingMatch',
	data() {
		return {
			game: []
		};
	},
	components: {
		Matchfield
	},
	async created() {
		const gameCode = this.$route.params.gameCode;
		try {
			GameService.getGame(gameCode).then(async game => {
				// add player to game
				const player = this.$store.state.player;

				// redirect to player to enter area if its empty
				if (!player) {
					this.$router.push({
						path: '/game/enter'
					});
					return;
				}

				// if game is full
				if (
					!GameService.playerIsInGame(player, game) &&
					game.players.length >= game.maxPlayers
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
				if (game.players.filter(p => p.id === player.id).length === 0) {
					game = await GameService.addPlayerToGame(game.gameCode, player.id);
				}

				// add socket event for user joining	(test cases)
				this.$socket.emit('playerJoinGame', {player});

				this.game = game;
			});
		} catch (err) {
			this.$router.push({
				name: 'home',
				params: {
					error: 'Sorry, da ist etwas schief gelaufen.. (Fehlercode: #WM)'
				}
			});
			return;
		}
	},
	sockets: {
		updateGameVars: function() {
			const gameCode = this.$route.params.gameCode;
			GameService.getGame(gameCode).then(async game => {
				this.game = game;
			});
		}
	},
	methods: {
		concatUsernames(players) {
			var returnStr = '';

			for (let i = 0; i < players.length; i++) {
				returnStr +=
					players[i].username + (i + 1 === players.length ? '' : ', ');
			}

			return returnStr;
		}
	}
};
</script>
