const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');


const mimTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"
}

http.createServer((req, res) => {
  const uri = url.parse(req.url).pathname;
  const fileName = path.join(process.cwd(), unescape(uri));
  console.log(`loading ${uri}`)
  let stats;
  try {
    stats = fs.lstatSync(fileName);
  } catch (e) {
    res.writeHead(404, {
      'Content-type': 'text/plain'
    });
    res.write('404 not found');
    res.end();
    return;
  }
  if (stats.isFile()) {
    let mimType = mimTypes[path.extname(fileName).split(".").reverse()[0]]
    res.writeHead(200, {
      'Content-type': mimType
    });
    let fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);
  } else if (stats.isDirectory()) {
    res.writeHead(302, {
      'Location': 'index.html'
    });
    res.end();
  } else {
    res.writeHead(500, {
      'Content-type': 'text/plain'
    })
    res.write('500 Internal Error');
    res.end();
  }
}).listen(1337);

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });