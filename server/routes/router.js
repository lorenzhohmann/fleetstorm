const express = require('express');
const router = express.Router();
// const db = require('../lib/db.js');	// Feature for Future
const Manager = require('../models/Manager.js');

router.get('/game', (req, res) => {
	const games = Manager.getGames();
	res.send(games);
});

router.get('/game/:gameCode', (req, res) => {
	const game = Manager.getGame(req.params.gameCode);
	if (!game) {
		res.status(404).send({
			error: 'Dieser Spielcode existiert nicht.'
		});
		return;
	}
	res.status(200).send(game);
});

router.post('/game', (req, res) => {
	const gameCode = req.body.gameCode;
	if (Manager.gameCodeExists(gameCode)) {
		res.status(400).send({
			error:
				'Dieser Spielcode existiert bereits. Bitte verwende einen anderen Code.'
		});
		return;
	}
	const newGame = Manager.addGame(gameCode);
	res.status(201).send(newGame);
});

router.post('/game/:gameCode/addPlayer/:playerID', (req, res) => {
	const gameCode = req.params.gameCode;
	const playerID = req.params.playerID;

	const game = Manager.getGame(gameCode);
	const player = Manager.getPlayer(playerID);

	if (!game || !player) {
		res.status(400).send({
			error: 'Das Spiel oder der Spieler existieren nicht.'
		});
		return;
	}

	game.addPlayer(playerID);
	res.status(200).send(game);
});

router.post('/game/:gameCode/removePlayer/:playerID', (req, res) => {
	const gameCode = req.params.gameCode;
	const playerID = req.params.playerID;

	const game = Manager.getGame(gameCode);
	const player = Manager.getPlayer(playerID);

	if (!game || !player) {
		res.status(400).send({
			error: 'Das Spiel oder der Spieler existieren nicht.'
		});
		return;
	}

	game.removePlayer(playerID);

	// delete game when empty
	if (game.playerIDs.length === 0) {
		Manager.deleteGame(game);
		res.status(200).send();
		return;
	}

	res.status(200).send(game);
});

router.put('/game', (req, res) => {
	const gameCode = req.body.game.gameCode;

	let game = Manager.getGame(gameCode);

	if (!game) {
		res.status(400).send({
			error: 'Dieses Spiel existiert nicht'
		});
		return;
	}

	Manager.updateGame(req.body.game);
	game = Manager.getGame(gameCode);
	res.status(200).send(game);
});

router.delete('/game/:gameCode', (req, res) => {
	const gameCode = req.params.gameCode;

	if (!Manager.gameCodeExists(gameCode)) {
		res.status(400).send({
			error: 'Dieses Spiel existiert nicht'
		});
		return;
	}
	Manager.deleteGame(gameCode);
	res.status(200).send();
});

router.post('/player', (req, res) => {
	const username = req.body.username;
	if (Manager.usernameExists(username)) {
		res.status(400).send({
			error:
				'Dieser Benutzername ist bereits vergeben. Bitte verwende einen anderen Namen.'
		});
		return;
	}
	const newPlayer = Manager.addPlayer(username);
	res.status(201).send(newPlayer);
});

router.put('/player', (req, res) => {
	const playerID = req.body.player.id;

	let player = Manager.getPlayer(playerID);

	if (!player) {
		res.status(400).send({
			error: 'Dieser Spieler existiert nicht'
		});
		return;
	}

	Manager.updatePlayer(req.body.player);
	player = Manager.getPlayer(playerID);
	res.status(200).send(player);
});

router.get('/player/:playerID', (req, res) => {
	const playerID = req.params.playerID;

	const player = Manager.getPlayer(playerID);

	if (!player) {
		res.status(400).send({
			error: 'Dieser Spieler existiert nicht'
		});
		return;
	}

	res.status(200).send(player);
});

router.get('/player', (req, res) => {
	const players = Manager.getPlayers();
	res.status(200).send(players);
});

router.delete('/player/:playerID', (req, res) => {
	const playerID = req.params.playerID;

	const player = Manager.getPlayer(playerID);

	if (!player) {
		res.status(400).send({
			error: 'Dieser Spieler existiert nicht'
		});
		return;
	}

	Manager.deletePlayer(playerID);
	res.status(200).send();
});

module.exports = router;
