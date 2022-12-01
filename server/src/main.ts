import express from 'express';
import http from 'http';
import { mongoDb } from './app/dal';
import { env, logger } from './config';
import { configApp, configPassport } from './config/init';


const port = env.apiPort || 3000;
const app = express();
const server = http.createServer(app);

configApp(app, port);
configPassport();

mongoDb.connect().then(() => {
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
}).catch(error => logger.error({ message: error, label: 'Server Init' }));

/**
 * Event listener for HTTP server 'error' event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error({ message: `${bind} requires elevated privileges`, label: 'Server Init' });
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error({ message: `${bind} is already in use`, label: 'Server Init' });
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server 'listening' event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    logger.info({ message: `Listening on ${bind}`, label: 'Server Init' });
}