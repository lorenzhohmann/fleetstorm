import axios from 'axios';

const url = 'http://localhost:3000/api/player';

export default {
	async createPlayer(username) {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await axios.post(url, {username});
				resolve(result.data);
			} catch (err) {
				reject(err);
			}
		});
	},
	async playerExists(username) {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await axios.get(url, {username});
				resolve(result.data);
			} catch (err) {
				reject(err);
			}
		});
	},
	async deletePlayer(playerID) {
		axios.delete(url, {playerID});
	}
};
