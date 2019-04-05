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

	game.addPlayer(player);
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

	game.removePlayer(player);
	res.status(200).send(game);
});

router.delete('/game', (req, res) => {
	const gameCode = req.body.gameCode;
	if (!Manager.gameCodeExists(gameCode)) {
		res.status(400).send({
			error: 'Dieses Spiel existiert nicht'
		});
		return;
	}
	Manager.deleteGame(gameCode);
	res.status(200).send();
});

router.delete('/game/:gameCode/removePlayer/:playerID', (req, res) => {
	const gameCode = req.params.gameCode;
	const playerID = req.params.playerID;
	console.log(gameCode, playerID);

	const game = Manager.getGame(gameCode);
	const player = Manager.getPlayer(playerID);

	if (!game || !player) {
		res.status(400).send({
			error: 'Das Spiel oder der Spieler existieren nicht.'
		});
		return;
	}

	game.removePlayer(player);
	if (game.players.length == 0) {
		Manager.deleteGame(game);
		res.status(200).send();
		return;
	}

	res.status(200).send(game);
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

	player = req.body.player;
	res.status(200).send(player);
});

router.get('/player', (req, res) => {
	const playerID = req.body.playerID;

	const player = Manager.getPlayer(playerID);

	if (!player) {
		res.status(400).send({
			error: 'Dieser Spieler existiert nicht'
		});
		return;
	}

	res.status(200).send(player);
});

router.delete('/player', (req, res) => {
	const username = req.body.username;
	if (!Manager.usernameExists(username)) {
		res.status(400).send({
			error: 'Dieser Spieler existiert nicht'
		});
		return;
	}
	Manager.deletePlayer(username);
	res.status(200).send();
});

module.exports = router;
