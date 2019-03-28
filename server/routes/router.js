const express = require('express');
const router = express.Router();
// const db = require('../lib/db.js');
const Manager = require('../models/Manager.js');

router.get('/game', (req, res) => {
	const games = Manager.getGames();
	res.send(games);
});

router.post('/game', (req, res) => {
	const newGame = Manager.addGame();
	res.status(201).send(newGame);
});

module.exports = router;
