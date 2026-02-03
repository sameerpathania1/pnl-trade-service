import { Router } from "express";
import * as portfolioController from "../controllers/trade.controller"

const router = Router();

router.get("/", portfolioController.getPortfolio);
router.get("/pnl", portfolioController.getPnl);

export default router;
