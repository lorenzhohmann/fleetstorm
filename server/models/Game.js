const uuid = require('uuid');

module.exports = class Game {
	constructor() {
		this.id = uuid.v4();
		this.maxPlayers = 4;
		this.running = false;
		this.players = [];
	}
	addPlayer(player) {
		if (players.length < this.maxPlayers) this.players.push(player);
	}
};
