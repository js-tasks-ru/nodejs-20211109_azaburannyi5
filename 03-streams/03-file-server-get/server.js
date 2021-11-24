const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
 
  switch (req.method) {
    case 'GET':
      getFileHandler(req, res);
      break;

    default:
      errorResponse(res, 501, 'Not implemented');
  }

});

module.exports = server;

function getFileHandler(req, res) {
  
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.indexOf('/') > 0) {
    return errorResponse(res, 400, 'Nested paths not suported');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  let stream = fs.createReadStream(filepath);
  
  stream.on('error', (error) => {
    
    if (error.code == 'ENOENT') {
      return errorResponse(res, 404, 'File not found');
    }

    return errorResponse(res, 500, 'Internal error');
  })

  stream.pipe(res);

  req.on('aborted', () => {
    stream.destroy();
  });

}

function errorResponse(res, code, message) {
  res.statusCode = code;
  res.end(message);
}