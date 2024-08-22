'use strict';

const cluster = require('cluster');
const express = require('express');
const numCPUs = 6; 

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) 
        cluster.fork();
    
    cluster.on('exit', (worker, code, signal) => {
        cluster.fork(); 
    });
} else {
    const app = express();

    app.get('/', (req, res) => {
        res.send('Hello world');
    });

    app.listen(3000, () => {});
}
