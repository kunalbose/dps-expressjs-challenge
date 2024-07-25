import express, { Express } from 'express';
import dotenv from 'dotenv';
import { router as projectRouter } from './controllers/projectController';
import { router as reportRouter } from './controllers/reportController';
import { router as specialRouter } from './controllers/specialController';
import { globalMiddleware } from './middlewares/globalMiddleware';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
// middleware authentication
app.use(globalMiddleware);

app.use('/project', projectRouter);
app.use('/report', reportRouter);
app.use('/special', specialRouter);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
