const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.statusMessage = 'Bad request!';

        res.end();

        break;
      }

      const limitSizeStream = new LimitSizeStream(
        { 
          limit: 1e6, 
          readableObjectMode: false,
        }
      );

      const writeStream = fs.createWriteStream(filepath, {
        'flags': 'wx',
      });

      req.pipe(limitSizeStream).pipe(writeStream);

      limitSizeStream.on('error', err => {
        console.log('limitSizeStream err', err.message);

        if (err.code === 'LIMIT_EXCEEDED') {
          console.log('LIMIT_EXCEEDED');
          res.statusCode = 413;
          res.statusMessage = 'File more than 1Mb';

          writeStream.end(() => {
            fs.unlink(filepath, err => {
              if (err) {
                throw err;
              }
            });
          });          
        } else {
          res.statusCode = 500;
          res.statusMessage = 'Internal server error';
        }

        res.end();
      });

      writeStream.on('error', err => {
        console.log('writeStream err', err.message);

        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.statusMessage = 'File is exist';
        } else {
          res.statusCode = 500;
          res.statusMessage = 'Internal server error';
        }

        res.end();
      });

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.statusMessage = 'File created!';

        res.end();
      });

      req.on('error', err => {
        console.log('req err', err.message);
        if (err.code === 'ECONNRESET' || 'ECONNABORTED') {

          writeStream.end(() => {
            fs.unlink(filepath, err => {
              if (err) {
                throw err;
              }
            });
          });
        } else {
          res.statusCode = 500;
          res.statusMessage = 'Internal server error';

          res.end();
        }
      });

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
