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
	async addPlayerToGame(gameCode, player) {},
	async deleteGame(gameCode) {
		axios.delete(url, {gameCode});
	}
};
