const Game = require('./Game');
const Player = require('./Player');

let games = [];
let players = [];

module.exports = class Manager {
	static addGame(gameCode) {
		const game = new Game(gameCode);
		games.push(game);
		return game;
	}
	static getGames() {
		return games;
	}
	static gameCodeExists(gameCode) {
		return games.filter(g => g.gameCode == gameCode).length >= 1;
	}
	static usernameExists(username) {
		return players.filter(p => p.username == username).length >= 1;
	}
	static addPlayer(username) {
		const player = new Player(username);
		players.push(player);
		return player;
	}
	static deletePlayer(username) {
		players = players.filter(p => p.username !== username);
	}
	static deleteGame(gameCode) {
		games = games.filter(g => g.gameCode !== gameCode);
	}
};
