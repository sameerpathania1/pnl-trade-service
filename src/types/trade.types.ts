import { z } from "zod";
import { TradeSchema } from "../validators/trade.validator";

export type Side = "buy" | "sell";
export type Symbol = string
export type TradeDto = z.infer<typeof TradeSchema>;

export interface Trade extends TradeDto {
  id: string;
  timestamp: string;
}

export interface Position {
  symbol: Symbol;
  quantity: number;
  avgEntryPrice: number;
}