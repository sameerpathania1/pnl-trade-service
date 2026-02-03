import { Trade, Position, Symbol } from "../types/trade.types";

/*
 * Maintains in-memory trading state:
 * - Open positions per symbol
 * - Executed trades
 * - Realized PnL
 *
 * Accounting method: Average Cost Method
 */
export class Portfolio {
  // All executed trades (append-only ledger)
  private trades: Trade[] = [];

  // Open positions keyed by trading symbol
  private positions: Record<Symbol, Position> = {};

  // Realized profit & loss from closed quantities
  private realizedPnL = 0;

  /**
   * Applies a trade to the portfolio using the
   * Average Cost method
   */
  applyTrade(trade: Trade) {
    // Initialize position if this is the first trade for the symbol
    const position = this.positions[trade.symbol] ?? (this.positions[trade.symbol] = {
      symbol: trade.symbol,
      quantity: 0,
      avgEntryPrice: 0,
    });

    if (trade.side === "buy") {
      /**
       * BUY LOGIC (Average Cost Method)

       * New Avg Price =
       * (Old Avg Price × Old Qty + Trade Price × Trade Qty)
       * ----------------------------------------------------
       *                New Total Quantity
       */
      const totalCost = (position.avgEntryPrice * position.quantity) + (trade.price * trade.quantity);

      position.quantity += trade.quantity;
      position.avgEntryPrice = totalCost / position.quantity;
    } else {
      /**
       * SELL LOGIC
        Realized PnL is calculated using the
        current average entry price.
      */
      if (position.quantity < trade.quantity) {
        throw new Error("Insufficient quantity");
      }

      this.realizedPnL += (trade.price - position.avgEntryPrice) * trade.quantity;

      position.quantity -= trade.quantity;

      // Reset avg price when position is fully closed
      if (position.quantity === 0) {
        position.avgEntryPrice = 0;
      }
    }

    // Record trade in execution history
    this.trades.push(trade);
  }

  /*
    Calculates unrealized PnL (mark-to-market)
    using externally supplied market prices.
  */
  getUnrealizedPnL(prices: Record<Symbol, number>) {
    let pnl = 0;

    for (const pos of Object.values(this.positions)) {
      const marketPrice = prices[pos.symbol];
      if (!marketPrice) continue;

      pnl += (marketPrice - pos.avgEntryPrice) * pos.quantity;
    }

    return pnl;
  }

  // -------- Read-only accessors --------

  getTrades() {
    return this.trades;
  }

  getPositions() {
    return this.positions;
  }

  getRealizedPnL() {
    return this.realizedPnL;
  }

  /*
    Resets portfolio state.
    Intended for tests or controlled lifecycle resets
  */
  reset() {
    this.trades = [];
    this.positions = {};
    this.realizedPnL = 0;
  }
}
