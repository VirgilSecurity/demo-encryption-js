const stream = require('stream');

module.exports = (pattern, replacement) => (new stream.Transform({
	transform(chunk, encoding, callback) {
		this.push(chunk.toString().replace(pattern, replacement));
		callback();
	}
}));