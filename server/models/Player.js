const uuid = require('uuid');

module.exports = class Player {
	constructor(name) {
		this.id = uuid.v4();
		this.name = name;
	}
};
