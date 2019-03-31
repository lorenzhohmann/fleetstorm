const express = require('express');
const router = express.Router();
// const db = require('../lib/db.js');	// Feature for Future
const Manager = require('../models/Manager.js');

router.get('/game', (req, res) => {
	const games = Manager.getGames();
	res.send(games);
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
