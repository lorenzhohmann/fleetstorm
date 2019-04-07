const Manager = require('./models/Manager');
const Game = require('./models/Game');
const Player = require('./models/Player');

module.exports = class GameMaster {
	constructor(gameCode, socket, io) {
		console.log('gamemaster for ' + gameCode + ' initialized');
		this.game = Manager.getGame(gameCode);
		this.socket = socket;
		this.io = io;
	}
	startGame() {
		this.game.state = 1;

		this.nextPlayer();
	}
	nextPlayer() {
		// get next player id
		let playerInTurn;
		this.game.nextPlayerIndex++;
		playerInTurn = Manager.getPlayer(
			this.game.playerIDs[this.game.nextPlayerIndex]
		);

		// emit to frontend
		// TODO start when all players online
		setInterval(() => {
			const allPlayers = Manager.getPlayers();
			const otherPlayers = [];
			allPlayers.forEach(player => {
				if (
					this.game.playerIDs.indexOf(player.id) > -1 &&
					player.id !== playerInTurn.id
				) {
					otherPlayers.push(player);
				}
			});
			this.io.emit('nextPlayer', {
				gameCode: this.game.gameCode,
				playerInTurn,
				otherPlayers
			});
		}, 10000);
	}
};
