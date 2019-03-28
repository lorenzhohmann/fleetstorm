import axios from 'axios';

const url = 'http://localhost:3000/api/game';

export default {
	async createGame() {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await axios.post(url);
				resolve(result.data);
			} catch (err) {
				reject(err);
			}
		});
	}
};
