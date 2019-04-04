import axios from 'axios';

const url = 'http://localhost:3000/api/player';

export default {
	createPlayer(username) {
		return axios.post(url, {username}).then(response => response.data);
	},
	playerExists(username) {
		return axios.get(url, {username}).then(response => response.data);
	},
	deletePlayer(playerID) {
		axios.delete(url, {playerID});
	},
	validateUsername(username) {
		return username.match(/^[0-9A-Za-z]{3,10}$/g);
	}
};
