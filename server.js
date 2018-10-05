const http = require('http');
const app = require('./app');

const port = process.env.PORT || 8082;
const server = http.createServer(app);

server.listen(port);

console.log('|--- Gandalf awaits at ' + port + ' ---| \n');
