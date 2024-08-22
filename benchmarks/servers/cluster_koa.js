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
    const Koa = require('koa');
    const app = new Koa();

    app.use(async ctx => {
        ctx.body = 'Hello world';
    });

    app.listen(3000);
}
