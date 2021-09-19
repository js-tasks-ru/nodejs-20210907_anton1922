const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.allDataSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.allDataSize += chunk.length;

    if (this.allDataSize > this.limit || chunk.length > this.limit) {
      callback(new LimitExceededError);
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
