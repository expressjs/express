/* Minimal HTTP/3 example */

const uWS = require('uWebSockets.js');
const port = 3000;

uWS.App().get('/*', (res, req) => {
  res.end('Hello World!');
}, 5).listen(port, () =>{});