import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { Symbol } from "../types/trade.types";
import { portfolio } from "../services/portfolio.instance";

const LATEST_PRICES: Record<Symbol, number> = {
  BTC: 40000,
  ETH: 2000,
};

export const processTrade = (req: Request, res: Response) => {
  const { symbol, side, price, quantity } = req.body;

  try {
    portfolio.applyTrade({
      id: uuid(),
      symbol,
      side,
      price,
      quantity,
      timestamp: new Date().toISOString(),
    });

    res.json({ message: "Trade added" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getPortfolio = (_req: Request, res: Response) => {
  const positions = Object.values(portfolio.getPositions()).filter(p => p.quantity > 0);
  res.json(positions);
};

export const getPnl = (_req: Request, res: Response) => {
  const realizedPnL = portfolio.getRealizedPnL();
  const unrealizedPnL = portfolio.getUnrealizedPnL(LATEST_PRICES);

  res.json({
    realizedPnL,
    unrealizedPnL,
    totalPnL: realizedPnL + unrealizedPnL,
  });
};

export const getTrades = (_req: Request, res: Response) => {
  res.json(portfolio.getTrades());
};