const uuid = require('uuid');

module.exports = class Game {
	// states: WAITING = 0, RUNNING = 1, ENDING = 2

	constructor(gameCode) {
		this.id = uuid.v4();
		this.maxPlayers = 4;
		this.minPlayers = 2;
		this.state = 0;
		this.playerIDs = [];
		this.gameCode = gameCode;
		this.fieldsize = 10;
		this.nextPlayerIndex = -1;
		this.winner = null;
	}
	addPlayer(playerID) {
		if (this.playerIDs.length < this.maxPlayers) this.playerIDs.push(playerID);
	}
	removePlayer(playerID) {
		this.playerIDs = this.playerIDs.filter(id => id !== playerID);
	}
};
