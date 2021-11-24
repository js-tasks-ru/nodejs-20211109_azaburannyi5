const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {

  switch (req.method) {
    case 'DELETE':
      deleteFileHandler(req, res);
      break;

    default:
      response(res, 501, 'Not implemented');
  }

});

module.exports = server;

function deleteFileHandler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.indexOf('/') > 0) {
    return response(res, 400, 'Nested paths not suported');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  if (!fs.existsSync(filepath)) {
    return response(res, 404, 'File not found');
  }

  fs.unlink(filepath, (err) => {
    if (err) {
      return response(res, 500, 'Internal error');
    }

    return response(res, 200, 'File deleted');
  })
}

function response(res, code, message) {
  res.statusCode = code;
  res.end(message);
}