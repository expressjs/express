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
    const Hapi = require('@hapi/hapi');

    const init = async () => {
        const server = Hapi.server({
            port: 3000,
            host: 'localhost'
        });

        server.route({
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                return 'Hello world';
            }
        });

        await server.start();
    };

    process.on('unhandledRejection', (err) => {
        console.log(err);
        process.exit(1);
    });

    init();
}
