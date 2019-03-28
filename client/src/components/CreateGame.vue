<template>
	<div>
		<h2>Spiel erstellen</h2>

		<div class="content-container">
			<div class="form-group">
				<input
					type="text"
					class="form-control"
					placeholder="Benutzername"
					v-model="username"
				/>
			</div>
			<button
				class="btn btn-success btn-block btn-lg"
				v-if="username != ''"
				v-on:click="createGame()"
			>
				Spiel erstellen
			</button>
			<div class="alert alert-danger mt-3" v-if="error">{{ error }}</div>
		</div>
	</div>
</template>

<script>
import GameService from '@/services/GameService.js';

export default {
	name: 'CreateGame',
	data() {
		return {
			username: '',
			error: ''
		};
	},
	methods: {
		async createGame() {
			try {
				const result = await GameService.createGame();
				this.addPlayerToGame(result.id, this.username);
			} catch (err) {
				this.error = err;
			}
		},
		async addPlayerToGame(gameID, username) {
			try {
				const result = await GameService.addPlayerToGame(gameID, username);
			} catch (err) {
				this.error = err;
			}
		}
	}
};
</script>
