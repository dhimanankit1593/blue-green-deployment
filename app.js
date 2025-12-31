let http = require('http');

const APP_COLOR = process.env.APP_COLOR || "UNKNOWN";

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`Hello World! from ${APP_COLOR} Application`);
}).listen(8000, '0.0.0.0', () => {
  console.log(`Server running on port 8000 (${APP_COLOR})`);
});
