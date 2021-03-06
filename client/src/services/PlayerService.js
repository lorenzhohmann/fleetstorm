import axios from 'axios';

const url = '/api/player';

export default {
	createPlayer(username) {
		return axios.post(url, { username }).then(response => response.data);
	},
	playerExists(username) {
		return axios.get(url, { username }).then(response => response.data);
	},
	deletePlayer(playerID) {
		axios.delete(`${url}/${playerID}`);
	},
	getPlayer(playerID) {
		return axios.get(`${url}/${playerID}`).then(response => response.data);
	},
	getPlayers() {
		return axios.get(url).then(response => response.data);
	},
	validateUsername(username) {
		return username.match(/^[0-9A-Za-z]{3,16}$/g);
	},
	updatePlayer(player) {
		return axios.put(url, { player }).then(response => response.data);
	}
};
