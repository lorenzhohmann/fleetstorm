import axios from 'axios';

const url = '/api/game';

export default {
	getGames() {
		return axios.get(url).then(response => response.data);
	},
	createGame(gameCode) {
		return axios.post(url, { gameCode });
	},
	getGame(gameCode) {
		return axios.get(`${url}/${gameCode}`).then(response => response.data);
	},
	addPlayerToGame(gameCode, playerID) {
		return axios
			.post(`${url}/${gameCode}/addPlayer/${playerID}`)
			.then(response => response.data);
	},
	deleteGame(gameCode) {
		axios.delete(`${url}/${gameCode}`);
	},
	playerIsInGame(player, game) {
		return game.playerIDs.filter(id => id === player.id).length;
	},
	removePlayer(gameCode, playerID) {
		return axios.post(`${url}/${gameCode}/removePlayer/${playerID}`);
	},
	updateGame(game) {
		return axios.put(url, { game }).then(response => response.data);
	},
	validateGameCode(gameCode) {
		return gameCode.match(/^[A-Za-z]{3,10}$/g);
	},
	getAlivePlayers(gameCode) {
		return axios
			.get(`${url}/${gameCode}/alivePlayers`)
			.then(response => response.data);
	}
};
