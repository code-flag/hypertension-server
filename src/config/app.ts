import express, { json, urlencoded } from 'express';
import { Application, Request, Response } from 'express';
import Logger from '../logger/logger';
import { DBConnection } from '../config/database';
import cors from 'cors';
import helmet from 'helmet';

//Route import
import { config } from 'dotenv';


const app: Application = express();

/*
DBConnection.once('open', () => Logger.info('Database connection successful'));
db.on('error', (error) => Logger.error(error));

app.use(urlencoded({ extended: true }));
app.use(json());

app.use(morganMiddleware);
app.use(cors());
app.use(helmet());
*/


app.use((req: Request, res: Response) => {
	return res.status(404).json('Page not found');
});

export { app };
