import { Router } from "express";
import * as tradeController from "../controllers/trade.controller"
import { TradeSchema } from "../validators/trade.validator";
import { validateSchema } from "../middlewares/validateSchema";

const router = Router();

router.post("/", validateSchema(TradeSchema), tradeController.processTrade);
router.get("/", tradeController.getTrades);

export default router;
