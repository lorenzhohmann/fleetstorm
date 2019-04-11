const path = require('path');

module.exports = {
	outputDir: path.resolve(__dirname, '../server/public'),
	devServer: {
		proxy: {
			'/api/game': {
				target: 'http://localhost:3000'
			},
			'/api/player': {
				target: 'http://localhost:3000'
			}
		}
	}
};
