import request from "supertest";
import { app } from "../src/app";
import { portfolio } from "../src/services/portfolio.instance";

describe("Trade Service Flow", () => {
  beforeEach(() => {
    portfolio.reset();
  });

  it("should calculate average price and pnl correctly", async () => {
    await request(app).post("/api/trades").send({
      symbol: "BTC",
      side: "buy",
      price: 40000,
      quantity: 1,
    });

    await request(app).post("/api/trades").send({
      symbol: "BTC",
      side: "buy",
      price: 42000,
      quantity: 1,
    });

    await request(app).post("/api/trades").send({
      symbol: "BTC",
      side: "sell",
      price: 43000,
      quantity: 1,
    });

    const pnl = await request(app).get("/api/portfolio/pnl");

    expect(pnl.status).toBe(200);
    expect(pnl.body.realizedPnL).toBe(2000);
    expect(pnl.body.unrealizedPnL).toBe(3000);
  });

  it("should return correct portfolio after multiple buys", async () => {
    await request(app).post("/api/trades").send({
      symbol: "ETH",
      side: "buy",
      price: 2000,
      quantity: 2,
    });

    await request(app).post("/api/trades").send({
      symbol: "ETH",
      side: "buy",
      price: 2200,
      quantity: 2,
    });

    const portfolio = await request(app).get("/api/portfolio");

    expect(portfolio.status).toBe(200);
    expect(portfolio.body).toEqual([
      {
        symbol: "ETH",
        quantity: 4,
        avgEntryPrice: 2100,
      },
    ]);
  });

  it("should return zero pnl when no trades exist", async () => {
    const pnl = await request(app).get("/api/portfolio/pnl");

    expect(pnl.status).toBe(200);
    expect(pnl.body.realizedPnL).toBe(0);
    expect(pnl.body.unrealizedPnL).toBe(0);
    expect(pnl.body.totalPnL).toBe(0);
  });

  it("should handle selling entire position correctly", async () => {
    await request(app).post("/api/trades").send({
      symbol: "BTC",
      side: "buy",
      price: 40000,
      quantity: 1,
    });

    await request(app).post("/api/trades").send({
      symbol: "BTC",
      side: "sell",
      price: 42000,
      quantity: 1,
    });

    const portfolio = await request(app).get("/api/portfolio");
    const pnl = await request(app).get("/api/portfolio/pnl");

    expect(portfolio.body).toEqual([]);
    expect(pnl.body.realizedPnL).toBe(2000);
    expect(pnl.body.unrealizedPnL).toBe(0);
  });

  it("should reject selling more than owned quantity", async () => {
    await request(app).post("/api/trades").send({
      symbol: "BTC",
      side: "buy",
      price: 40000,
      quantity: 1,
    });

    const sell = await request(app).post("/api/trades").send({
      symbol: "BTC",
      side: "sell",
      price: 41000,
      quantity: 2,
    });

    expect(sell.status).toBe(400);
    expect(sell.body.error).toBeDefined();
  });

  it("should support multiple symbols independently", async () => {
    await request(app).post("/api/trades").send({
      symbol: "BTC",
      side: "buy",
      price: 40000,
      quantity: 1,
    });

    await request(app).post("/api/trades").send({
      symbol: "ETH",
      side: "buy",
      price: 2000,
      quantity: 5,
    });

    const portfolio = await request(app).get("/api/portfolio");

    expect(portfolio.body.length).toBe(2);
    expect(portfolio.body).toEqual(
      expect.arrayContaining([
        { symbol: "BTC", quantity: 1, avgEntryPrice: 40000 },
        { symbol: "ETH", quantity: 5, avgEntryPrice: 2000 },
      ])
    );
  });
});
