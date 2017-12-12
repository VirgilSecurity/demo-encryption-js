const path = require('path');
const fs = require('fs');

function makeDb() {
	const filename = path.resolve(__dirname, '../../.data/data.json');
	let data = { users: [] };

	const initialize = new Promise((resolve, reject) => {
		fs.readFile(filename, 'utf8', (err, contents) => {
			if (err) {
				if (err.code === 'ENOENT') {
					return resolve();
				}

				reject(err);
			}

			data = JSON.parse(contents);
			resolve();
		});
	});

	return {
		getUsers() {
			return initialize.then(() => data.users);
		},

		saveUser(user) {
			data.users.push(user);
			return safeWriteFile(JSON.stringify(data));
		}
	};

	function safeWriteFile(contents) {
		function writeAsync() {
			return new Promise((resolve, reject) => {
				fs.writeFile(filename, contents, err => {
					if (err) reject(err);
					resolve();
				})
			});
		}

		function makeDirAsync() {
			return new Promise((resolve, reject) => {
				fs.mkdir(path.dirname(filename), err => {
					if (err) reject(err);
					resolve();
				})
			});
		}


		return writeAsync()
			.catch(err => {
				if (err.code === 'ENOENT') {
					return makeDirAsync().then(writeAsync);
				}
				throw err;
			})
	}
}

module.exports = makeDb();