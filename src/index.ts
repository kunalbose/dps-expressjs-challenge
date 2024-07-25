import express, { Express } from 'express';
import dotenv from 'dotenv';
import { router as projectRouter } from './controllers/projectController';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/project', projectRouter);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
