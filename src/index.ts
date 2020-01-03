import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';

import './core/db';
import createRoutes from './core/routes';
import createSoket from './core/socket';

const app = express();
const http = createServer(app);
const io = createSoket(http);

dotenv.config();

createRoutes(app, io);

http.listen(process.env.PORT, () => {
	console.log(`Server is running: http://localhost: ${process.env.PORT}!`);
});
