const { startServer, getMessageFromCpp, processResponse } = require('../build/Release/cmmv_binding');

async function consumerLoop(id) {
    setInterval(async () => {
        const message = getMessageFromCpp();

        if (message && message.reqId) 
            processResponse(message.reqId, `Hello from Consumer ${id}`);        
    }, 1)
}

startServer('127.0.0.1', 3000);

const numConsumers = 24;
for (let i = 1; i <= numConsumers; i++) {
    consumerLoop(i).catch((error) => console.error(`Erro no Consumer ${i}:`, error));
}
