'use strict';

const { Worker, isMainThread } = require('worker_threads');
const uWS = require('uWebSockets.js');
const numCPUs = 6;
const port = 3000;

if (isMainThread) {
	for (let i = 0; i < numCPUs; i++) 
    	new Worker(__filename);
} else {
	const app = uWS.App().get('/*', (res, req) => {
		res.end('Hello World!');
	}).listen(port, (token) => {});
}