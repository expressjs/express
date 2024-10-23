'use strict';

const cluster = require('cluster');
const numCPUs = 6; 

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        cluster.fork(); 
    });
} else {
    const fastify = require('fastify')();

    fastify.get('/', async (req, reply) => {
        reply.send('Hello world');
    });

    fastify.listen({ port: 3000 }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
    });
}
