const uuid = require('uuid');

module.exports = class Game {
	constructor(gameCode) {
		this.id = uuid.v4();
		this.maxPlayers = 4;
		this.state = 'waiting';
		this.players = [];
		this.gameCode = gameCode;
		this.fieldsize = 15;
	}
	addPlayer(player) {
		if (this.players.length < this.maxPlayers) this.players.push(player);
	}
};
