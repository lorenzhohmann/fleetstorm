const Game = require('./Game');

const games = [];

module.exports = class Manager {
	static addGame() {
		const game = new Game();
		games.push(game);
		return game;
	}
	static getGames() {
		return games;
	}
};
