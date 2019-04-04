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
		this.team1 = [];
		this.team2 = [];
	}
	addPlayer(player) {
		if (this.players.length < this.maxPlayers) this.players.push(player);

		this.addToTeam(player);
	}
	addToTeam(player) {
		if (this.team1.length > this.team2.length) {
			this.team2.push(player);
		} else {
			this.team1.push(player);
		}
	}
	removePlayer(player) {
		this.players = this.players.filter(p => p.id !== player.id);
		this.team1 = this.team1.filter(t1 => t1.id !== t1.id);
		this.team2 = this.team2.filter(t2 => t2.id !== t2.id);
	}
};
