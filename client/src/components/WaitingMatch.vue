<template>
	<div>
		<div class="match-area">
			<div class="info-container section">
				<h3>Spielinfos</h3>
				<p v-if="game.playerIDs.length">
					<b>Aktuelle Spieleranzahl: </b>[{{ game.playerIDs.length }}/{{
						game.maxPlayers
					}}]
				</p>
				<p><b>minimale Spieleranzahl:</b> {{ game.minPlayers }}</p>
				<p><b>Feldgröße: </b>{{ game.fieldsize }}x{{ game.fieldsize }}</p>
				<p v-if="game.playerIDs.length"><b>Spielleiter: </b>{{ adminName }}</p>
				<p v-if="game.playerIDs.length">
					<b>Spieler: </b>{{ getPlayernames(game.playerIDs) }}
				</p>
			</div>
			<div class="section">
				<h3>Schiffe positionieren</h3>
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
			player: {}
		};
	},
	components: {
		Matchfield
	},
	created() {
		// get gameCode from store (set in Enter or Create Game)
		const gameCode = this.$route.params.gameCode;

		const player = this.$store.state.player;
		this.player = player;

		// search for game
		GameService.getGame(gameCode)
			.then(async game => {
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
				if (!GameService.playerIsInGame(player, game)) {
					game = await GameService.addPlayerToGame(game.gameCode, player.id);
				}

				// add socket event for user joining	(test cases)
				this.$socket.emit('playerJoinGame', {player});

				// TODO FIND ERROR get admin name
				// this.adminName = await PlayerService.getPlayer(game.playerIDs[0]);

				this.game = game;
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
			const gameCode = this.$route.params.gameCode;
			GameService.getGame(gameCode).then(async game => {
				this.game = game;
			});
		}
	},
	methods: {
		async getPlayernames(playerIDs) {
			let returnStr = '';

			// TODO (not working)

			PlayerService.getPlayers(players => {
				console.log(players);
			});

			// for (let i = 0; i < playerIDs.length; i++) {
			// 	let player = players.filter(p => p.id === playerIDs[i]);

			// 	returnStr += player.username;

			// 	returnStr += player.ready ? ' (bereit)' : ' (nicht bereit)';

			// 	returnStr += i + 1 === playerIDs.length ? '' : ', ';
			// }

			return returnStr;
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
