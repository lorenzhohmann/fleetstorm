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
				<p>
					<b>Feldgröße: </b>{{ game.fieldsize }}x{{ game.fieldsize }}
				</p>
				<p v-if="game.players.length">
					<b>Spielleiter: </b>{{ game.players[0].username }}
				</p>
				<p v-if="game.players.length">
					<b>Spieler: </b>{{ concatUsernames(game.players) }}
				</p>
			</div>
			<div class="section">
				<h3>Schiffe positionieren</h3>
				<Matchfield
					v-bind:game="game"
					v-bind:player="player"
					v-on:leave-game="leaveGame()"
				/>
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
			game: null,
			player: null
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
							error:
								'Die maximale Spieleranzahl ist bereits erreicht.'
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
					game = GameService.addPlayerToGame(
						game.gameCode,
						player.id
					);
				}

				// add socket event for user joining	(test cases)
				this.$socket.emit('playerJoinGame', { player });

				this.game = game;
				this.player = player;
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
					players[i].username +
					(i + 1 === players.length ? '' : ', ');
			}

			return returnStr;
		},
		leaveGame() {
			// TODO check function

			// remove player from game
			GameService.removePlayer(this.game.gameCode, this.player.id);

			// delete player
			console.log(this.player);
			PlayerService.deletePlayer(this.player.username);
			this.$store.dispatch('setPlayer', null);

			// update socket view
			this.$socket.emit('playerLeaveGame');

			// redirect to home
			this.$router.push({
				name: 'home',
				params: {
					error: 'Sie haben das Spiel verlassen.'
				}
			});
		}
	}
};
</script>
