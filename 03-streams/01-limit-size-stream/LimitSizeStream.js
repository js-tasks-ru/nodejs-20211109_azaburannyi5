const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    
    this.limit = options.limit;
    this.dataStreamed = 0
  }

  _transform(chunk, encoding, callback) {

    this.dataStreamed += chunk.length;

    if (this.dataStreamed > this.limit) {
      return callback(new LimitExceededError, chunk)
    }

    return callback(null, chunk)
  }
}

module.exports = LimitSizeStream;
