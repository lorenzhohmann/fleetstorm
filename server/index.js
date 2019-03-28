const express = require('express');
const socket = require('socket.io');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const router = require('./routes/router.js');
app.use('/api', router);

// fallback for RestAPI
app.use((req, res) => res.status(404).send());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
