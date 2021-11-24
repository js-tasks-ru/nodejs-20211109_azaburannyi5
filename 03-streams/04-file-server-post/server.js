const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream')

const server = new http.Server();

server.on('request', (req, res) => {

  switch (req.method) {
    case 'POST':
      uploadFileHandler(req, res);
      break;

    default:
      response(res, 501, 'Not implemented');
  }

});

module.exports = server;

function uploadFileHandler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.indexOf('/') > 0) {
    return response(res, 400, 'Nested paths not suported');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  if (fs.existsSync(filepath)) {
    return response(res, 409, 'File exists');
  }

  let limitStream = new LimitSizeStream({limit: 1000000});
  let writeStream = fs.createWriteStream(filepath);

  req
    .on('close', () => {
      response(res, 201, 'File created');
    })
    .on('aborted', () => {
      fs.unlink(filepath, () => {
        limitStream.destroy();
        writeStream.destroy();
      });
    })
    .pipe(limitStream)
    .on('error', () => {
      fs.unlink(filepath, () => {
        response(res, 413, 'Size limit exceed');
      });
    })
    .pipe(writeStream)
    .on('error', () => {
      fs.unlink(filepath, () => {
        response(res, 500, 'Internal error');
      });
    })
}

function response(res, code, message) {
  res.statusCode = code;
  res.end(message);
}