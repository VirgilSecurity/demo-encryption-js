const db = require('../db/db');
const uniqueId = require('../utils/uniqueId');

module.exports = {
	create(user) {
		user.id = uniqueId();
		return db.saveUser(user).then(() => user);
	},

	exists(username) {
		return db.getUsers().then(users => users.some(user => user.username === username));
	},

	queryByName(name) {
		return db.getUsers().then(users => users.filter(user => user.username.indexOf(name) > -1));
	}
};

