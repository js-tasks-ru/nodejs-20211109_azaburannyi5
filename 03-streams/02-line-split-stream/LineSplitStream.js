const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.line = "";
  }

  _transform(chunk, encoding, callback) {

    let str = chunk.toString(this.encoding);

    str.split("").forEach((symbol) => {
      if (symbol == os.EOL) {

        this.push(this.line);

        this.line = "";

      } else {
        this.line += symbol
      }
      
    });

    callback();
  }

  _flush(callback) {

    this.push(this.line);

    callback();    
  }
}

module.exports = LineSplitStream;
