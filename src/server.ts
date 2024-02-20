import * as dotenv from "dotenv";
const env = dotenv.config();
if (env.error) {
    console.error('Error loading environment variables, aborting...');
    process.exit(1);
}

import fastify from 'fastify';
import { root } from './routes/root.js';
import { isInteger } from './utils.js';
import { logger } from "./logger.js";
import { AppDataSource } from "./data-source.js";

const portEnv = process.env.PORT;
const portArg = process.argv[2];
let port:number;

if (isInteger(portEnv)) {
    port = parseInt(portEnv);
} else if (isInteger(portArg)) {
    port = parseInt(portArg);
} else {
    port = 3000;
}

AppDataSource.initialize().then(() => {
    logger.info('The datasource has been initialized successfully.');

    const server = fastify();

    server.get('/', root);

    server.listen({ port }, (error, address) => {
        if (error) {
            logger.error(error);
            process.exit(1);
        }
        logger.info(`Server listening at ${address}`);
    });
}).catch(err => {
    logger.error(`Error during datasource initialization.`, err);
    process.exit(1);
});
