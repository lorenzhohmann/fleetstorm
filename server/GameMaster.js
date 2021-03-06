const Manager = require('./models/Manager');
const Game = require('./models/Game');
const Player = require('./models/Player');

module.exports = class GameMaster {
	static startGame(gameCode, io) {
		const game = Manager.getGame(gameCode);

		if (game.state === 0) {
			game.state = 1;

			GameMaster.nextPlayer(gameCode, io);
		}
	}
	static nextPlayer(gameCode, io) {
		const game = Manager.getGame(gameCode);

		// get next player id
		let playerInTurn;

		while (!playerInTurn || playerInTurn.dead) {
			game.nextPlayerIndex++;

			// set 0 if end of array
			if (game.nextPlayerIndex >= game.playerIDs.length)
				game.nextPlayerIndex = 0;

			playerInTurn = Manager.getPlayer(game.playerIDs[game.nextPlayerIndex]);
		}

		// emit to frontend
		setTimeout(() => {
			const allPlayers = Manager.getPlayers();
			const otherPlayers = [];
			allPlayers.forEach(player => {
				if (
					game.playerIDs.indexOf(player.id) > -1 &&
					player.id !== playerInTurn.id
				) {
					otherPlayers.push(player);
				}
			});
			io.emit('nextPlayer', {
				gameCode: game.gameCode,
				playerInTurn,
				otherPlayers
			});
		}, 1000);
	}
};
