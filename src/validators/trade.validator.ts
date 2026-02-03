import { z } from "zod";

export const TradeSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  side: z.enum(["buy", "sell"]),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().positive("Quantity must be positive"),
});