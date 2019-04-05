const uuid = require('uuid');

module.exports = class Game {
	// states: WAITING = 0, RUNNING = 1, ENDING = 2

	constructor(gameCode) {
		this.id = uuid.v4();
		this.maxPlayers = 4;
		this.state = 0;
		this.players = [];
		this.gameCode = gameCode;
		this.fieldsize = 10;
	}
	addPlayer(player) {
		if (this.players.length < this.maxPlayers) this.players.push(player);
	}
	removePlayer(player) {
		this.players = this.players.filter(p => p.id !== player.id);
	}
};
