<template>
	<div>
		<div class="match-area">
			<div class="info-container section">
				<h3>Spielinfos</h3>
				<p v-if="game.players.length">
					<b>Aktuelle Spieleranzahl: </b>[{{ game.players.length }}/{{
						game.maxPlayers
					}}]
				</p>
				<p><b>Feldgröße: </b>{{ game.fieldsize }}x{{ game.fieldsize }}</p>
				<p v-if="game.players.length">
					<b>Spielleiter: </b>{{ game.players[0].username }}
				</p>
				<p v-if="game.team1.length">
					<b>Team 1: </b>{{ concatUsernames(game.team1) }}
				</p>
				<p v-if="game.team2.length">
					<b>Team 2: </b>{{ concatUsernames(game.team2) }}
				</p>
			</div>
			<div class="section">
				<h3>Schiffe positionieren</h3>
				<div class="btn btn-primary" v-on:click="randomOrderShips()">
					Schiffe zufällig anordnen
				</div>
				<Matchfield v-bind:game="game" />
			</div>
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
	created() {
		// get gameCode from store (set in Enter or Create Game)
		const gameCode = this.$route.params.gameCode;

		// search for game
		GameService.getGame(gameCode)
			.then(game => {
				// add player to game
				const player = this.$store.state.player;

				// redirect user to enter area if no player is set
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
				if (!GameService.playerIsInGame(player, game)) {
					game = GameService.addPlayerToGame(game.gameCode, player.id);
				}

				// add socket event for user joining	(test cases)
				this.$socket.emit('playerJoinGame', {player});

				this.game = game;
				return;
			})
			.catch(() => {
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
		},
		randomOrderShips() {
			// TODO pass to child component
			this.$emit('random-order-ships');
		}
	}
};
</script>
