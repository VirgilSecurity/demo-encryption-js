const http = require('http');
const app = require('./server/app');

const server = http.createServer(app);
const PORT = process.env.PORT || 8888;

server.listen(PORT, () => {
	console.log(`Hello World Server listening on ${PORT}`);
});
