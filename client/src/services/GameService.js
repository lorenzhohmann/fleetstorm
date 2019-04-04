import axios from 'axios';

const url = 'http://localhost:3000/api/game';

export default {
	getGames() {
		return axios.get(url);
	},
	createGame(gameCode) {
		return axios.post(url, {gameCode});
	},
	getGame(gameCode) {
		return axios.get(`${url}/${gameCode}`).then(response => response.data);
	},
	addPlayerToGame(gameCode, playerID) {
		return axios.post(`${url}/${gameCode}/addPlayer/${playerID}`);
	},
	deleteGame(gameCode) {
		axios.delete(url, {gameCode});
	},
	playerIsInGame(player, game) {
		return game.players.filter(p => p.id === player.id).length;
	}
};
