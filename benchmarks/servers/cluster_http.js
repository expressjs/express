'use strict';

const cluster = require('cluster');
const http = require('http');
const numCPUs = 6; 

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) 
        cluster.fork();
    
    cluster.on('exit', (worker, code, signal) => {
        cluster.fork(); 
    });
} else {
    const requestListener = (req, res) => {
        if (req.method === 'GET' && req.url === '/') {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Hello world');
        }
    };

    const server = http.createServer(requestListener);
    server.listen(3000);
}
