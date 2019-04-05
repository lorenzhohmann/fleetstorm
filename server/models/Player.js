const uuid = require('uuid');

module.exports = class Player {
	constructor(username) {
		this.id = uuid.v4();
		this.username = username;
		this.ships = [];
		this.ready = false;
	}
};
