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
				<p><b>Mitspieler: </b>{{ concatUsernames(game.players) }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import GameService from '@/services/GameService.js';

export default {
	name: 'Match',
	data() {
		return {
			game: null
		};
	},
	async created() {
		const gameCode = this.$route.params.gameCode;
		try {
			GameService.getGame(gameCode).then(async game => {
				// add player to game
				const player = this.$store.state.player;

				// if game not full and state = waiting
				if (game.players.length >= game.maxPlayers || game.state != 'waiting') {
					this.$router.push('/'); // TODO exit message on home screen
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
			this.$router.push('/'); // TODO exit message on home screen
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
