import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { registerRoutes } from './routes';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
const isProd = process.env.NODE_ENV === "production"
if (!isProd) {
  app.use(morgan('dev'));
}

registerRoutes(app);