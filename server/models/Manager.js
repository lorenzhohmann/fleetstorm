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
	static getGame(gameCode) {
		return games.filter(g => g.gameCode == gameCode)[0];
	}
	static gameCodeExists(gameCode) {
		return this.getGame(gameCode);
	}
	static deleteGame(gameCode) {
		games = games.filter(g => g.gameCode !== gameCode);
	}
	static updateGame(game) {
		games.forEach((g, index) => {
			if (g.gameCode === game.gameCode) {
				g.maxPlayers = game.maxPlayers;
				g.minPlayers = game.minPlayers;
				g.state = game.state;
				g.playerIDs = game.playerIDs;
				g.gameCode = game.gameCode;
				g.fieldsize = game.fieldsize;
				g.public = game.public;
				g.nextPlayerIndex = game.nextPlayerIndex;
				g.winner = game.winner;
			}
		});
	}

	static usernameExists(username) {
		return players.filter(p => p.username === username).length >= 1;
	}
	static getPlayers() {
		return players;
	}
	static updatePlayer(player) {
		players.forEach((p, index) => {
			if (p.id === player.id) {
				p.id = player.id;
				p.username = player.username;
				p.ships = player.ships;
				p.ready = player.ready;
				p.hits = player.hits;
				p.dead = player.dead;
			}
		});
	}
	static addPlayer(username) {
		const player = new Player(username);
		players.push(player);
		return player;
	}
	static getPlayer(playerID) {
		return players.filter(p => p.id === playerID)[0];
	}
	static deletePlayer(playerID) {
		players = players.filter(p => p.id !== playerID);
	}
};
