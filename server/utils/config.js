'use strict'

const fs = require('fs');

const jsonPath = 'config.json';

function getConfig () {
	if (fs.existsSync(jsonPath)) {
		const data = fs.readFileSync(jsonPath);
		return JSON.parse(data);
	} else {
		require('dotenv').config();
		return process.env;
	}
}

const config = getConfig();

module.exports = () => config;