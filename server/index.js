const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const cors = require('cors');

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

	socket.on('disconnect', data => {
		io.emit('updateGameVars');
	});
});

const router = require('./routes/router.js');
app.use('/api', router);

// fallback for RestAPI
app.use((req, res) => res.status(404).send());

http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
