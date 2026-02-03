import { Express } from 'express';
import tradeRoutes from './routes/trade.routes';
import portfolioRoutes from './routes/portfolio.route';
import { swaggerSpec } from "./docs/swagger";
import swaggerUi from "swagger-ui-express";

export const registerRoutes = (app: Express) => {
  app.get('/', (_req, res) => res.send({ message: "Welcome to PnL Trade Service APIs v1.0" }));
  app.use('/api/trades', tradeRoutes);
  app.use('/api/portfolio', portfolioRoutes);
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};