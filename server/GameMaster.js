const Manager = require('./models/Manager');
const Game = require('./models/Game');
const Player = require('./models/Player');

module.exports = class GameMaster {
	constructor(gameCode, socket, io) {
		console.log('gamemaster for ' + gameCode + ' initialized');
		this.game = Manager.getGame(gameCode);
		this.socket = socket;
		this.interval;
		this.io = io;
	}
	startGame() {
		if (this.game.state === 0) {
			this.game.state = 1;

			this.nextPlayer();
		}
	}
	nextPlayer() {
		console.log('NEXT PLAYER');
		// get next player id
		let playerInTurn;
		this.game.nextPlayerIndex++;

		// set 0 if end of array
		if (this.game.nextPlayerIndex >= this.game.playerIDs.length)
			this.game.nextPlayerIndex = 0;

		playerInTurn = Manager.getPlayer(
			this.game.playerIDs[this.game.nextPlayerIndex]
		);
		console.log(this.game);

		// emit to frontend
		// TODO start when all players online
		clearInterval(this.interval);
		// this.interval = setInterval(() => {
		setTimeout(() => {
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
		}, 1000);
		// }, 1000);

		// socket for next player
		this.socket.on('nextPlayer', data => {
			console.log(this.game.gameCode);
			console.log('next player in ' + data.gameCode);
			if (data.gameCode === this.game.gameCode) {
				this.nextPlayer();
			}
		});
	}
};
