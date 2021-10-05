const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.accuString = '';
    this.lastString = '';
  }

  _transform(chunk, encoding, callback) {
    const string = chunk.toString();
    const arrayStrings = string.split(os.EOL);

    for (let i = 0; i < arrayStrings.length; i++) {
      if (i === arrayStrings.length - 1) {
        this.lastString = this.accuString + arrayStrings[i];
        this.accuString = arrayStrings[i];
      } else {
        this.push(this.accuString + arrayStrings[i]);
        this.accuString = '';
      }
    }

    callback(null);
  }

  _flush(callback) {
    this.push(this.lastString);

    this.lastString = null;
    this.accuString = null;

    callback(null);
  }
}

module.exports = LineSplitStream;
