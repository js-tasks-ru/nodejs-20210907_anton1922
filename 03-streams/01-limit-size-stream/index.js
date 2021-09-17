const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');

const limit = 8;

const limitedStream = new LimitSizeStream({limit, encoding: 'utf-8', highWaterMark: limit}); // 8 байт
const outStream = fs.createWriteStream('out.txt');

limitedStream.pipe(outStream);

limitedStream.write('hello'); // 'hello' - это 5 байт, поэтому эта строчка целиком записана в файл

setTimeout(() => {
  limitedStream.write('world'); // ошибка LimitExceeded! в файле осталось только hello
}, 10);

limitedStream.on('error', (err) => {
  console.log('err', err);
});
