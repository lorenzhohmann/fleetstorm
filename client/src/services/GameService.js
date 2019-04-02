import axios from 'axios';

const url = 'http://localhost:3000/api/game';

export default {
	async createGame(gameCode) {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await axios.post(url, {gameCode});
				resolve(result.data);
			} catch (err) {
				reject(err);
			}
		});
	},
	async getGame(gameCode) {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await axios.get(`${url}/${gameCode}`);
				resolve(result.data);
			} catch (err) {
				reject(err);
			}
		});
	},
	async addPlayerToGame(gameCode, playerID) {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await axios.post(
					`${url}/${gameCode}/addPlayer/${playerID}`
				);
				resolve(result.data);
			} catch (err) {
				reject(err);
			}
		});
	},
	deleteGame(gameCode) {
		axios.delete(url, {gameCode});
	},
	async getGame(gameCode) {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await axios.get(url + '/' + gameCode);
				resolve(result.data);
			} catch (err) {
				reject(err);
			}
		});
	},
	playerIsInGame(player, game) {
		return game.players.filter(p => p.id === player.id).length;
	}
};
