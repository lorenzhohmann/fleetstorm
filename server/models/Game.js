const uuid = require('uuid');

module.exports = class Game {
	constructor(gameCode) {
		this.id = uuid.v4();
		this.maxPlayers = 4;
		this.running = false;
		this.players = [];
		this.gameCode = gameCode;
	}
	addPlayer(player) {
		if (players.length < this.maxPlayers) this.players.push(player);
	}
};
