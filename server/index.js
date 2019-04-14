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

	socket.on('disconnect', data => {
		io.emit('updateGameVars');
	});

	// sockets for playing game
	socket.on('playingUpdate', data => {
		io.emit('playingUpdate', data);
	});

	// sockets for gamemaster
	socket.on('startGame', data => {
		GameMaster.startGame(data.gameCode, io);
	});

	socket.on('nextPlayer', data => {
		GameMaster.nextPlayer(data.gameCode, io);
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
