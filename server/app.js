const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const boom = require('boom');
const users = require('./users/userController');
const streamReplace = require('./utils/streamReplace');
const config = require('./utils/config');

const app = express();
const publicPath = path.resolve(__dirname, '../public');

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', indexHandler);

app.use(express.static(publicPath));

app.post('/users', (req, res, next) => {
	users.create(req.body)
		.then(user => res.send(user))
		.catch(next);
});

app.get('/users', (req, res, next) => {
	users.list(req.query.name)
		.then(users => res.send(users))
		.catch(next);
});

app.get('*', indexHandler);

app.use(handleError);

function indexHandler(req, res) {
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	fs.createReadStream(path.join(publicPath , 'index.html'))
		.pipe(streamReplace('{{VIRGIL_APP_ACCESS_TOKEN}}', config().VIRGIL_APP_ACCESS_TOKEN))
		.pipe(res);
}

function handleError(err, req, res, next) {
	if (!err.isBoom) {
		console.error('Unexpected error: ', err);
		err = boom.badImplementation('Internal server error.');
	}

	res.status(err.output.statusCode).json(err.output.payload);
}

module.exports = app;