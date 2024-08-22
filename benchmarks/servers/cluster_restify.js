'use strict';

const cluster = require('cluster');
const numCPUs = 6; 

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) 
        cluster.fork();
    
    cluster.on('exit', (worker, code, signal) => {
        cluster.fork(); 
    });
} else {
    const restify = require('restify');

    const server = restify.createServer();

    server.get('/', (req, res, next) => {
        res.send('Hello world');
        next();
    });

    server.listen(3000);
}
