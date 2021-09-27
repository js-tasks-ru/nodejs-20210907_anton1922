const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname.includes('/')) {
        res.statusCode = 400;

        res.end('Bad request!');

        break;
      }

      const readStream = fs.createReadStream(filepath);

      readStream.on('error', err => {
        console.log('err', err);

        if(err.code === 'ENOENT') {
          res.statusCode = 404;
          res.statusMessage = 'File not found!';
        } else {
          res.statusCode = 500;
          res.statusMessage = 'Internal server error!';
        }
        
        res.end();
      });

      readStream.pipe(res);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

