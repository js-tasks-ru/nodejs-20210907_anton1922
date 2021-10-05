const os = require('os');
const LineSplitStream = require('./LineSplitStream');

const lines = new LineSplitStream({
  encoding: 'utf-8',
});

function onData(line) {
  console.log(line);
}

lines.on('data', onData);
lines.on('error', err => console.log(err));

lines.write(`первая строка${os.EOL}вторая строка${os.EOL}третья строка`);

lines.end();