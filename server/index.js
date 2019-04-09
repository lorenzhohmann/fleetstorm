const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const cors = require('cors');
const GameMaster = require('./GameMaster.js');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const startedGames = [];

io.on('connection', function(socket) {
	socket.on('playerJoinGame', data => {
		io.emit('updateGameVars');
	});
	socket.on('updateGameVars', data => {
		io.emit('updateGameVars');
	});

	socket.on('playerLeaveGame', data => {
		io.emit('updateGameVars');
	});

	socket.on('redirectToPlayingArea', data => {
		io.emit('redirectToPlayingArea', data);
	});

	socket.on('foobar', data => {
		console.log('foobar');
	});

	socket.on('startGame', data => {
		if (!startedGames.filter(code => code === data.gameCode).length) {
			startedGames.push(data.gameCode);
			const gm = new GameMaster(data.gameCode, socket, io);
			gm.startGame();
		} else {
			console.log('game already initialized');
		}
	});

	socket.on('disconnect', data => {
		io.emit('updateGameVars');
	});
});

const router = require('./routes/router.js');
app.use('/api', router);

// handle production
if (process.env.NODE_ENV === 'production') {
	// static folder
	app.use(express.static(__dirname + '/public'));

	// handle SPA
	app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

// fallback for RestAPI
app.use((req, res) => res.status(404).send());

http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
