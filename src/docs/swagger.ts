export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "PnL Trade Service API",
    version: "1.0.0",
    description: "In-memory trading service using Average Cost PnL",
  },
  paths: {
    "/api/trades": {
      tags: ["trades"],
      post: {
        summary: "Add a trade",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["symbol", "side", "price", "quantity"],
                properties: {
                  symbol: { type: "string", example: "BTC" },
                  side: { type: "string", enum: ["buy", "sell"] },
                  price: { type: "number", example: 40000 },
                  quantity: { type: "number", example: 1 }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Trade added successfully" },
          "400": { description: "Invalid input" }
        }
      },
      get: {
        summary: "Get all trades",
        responses: {
          "200": { description: "List of trades" }
        }
      }
    },

    "/api/portfolio": {
      tags: ["Portfolio"],
      get: {
        summary: "Get current portfolio",
        responses: {
          "200": { description: "Current holdings per symbol" }
        }
      }
    },
    "/api/portfolio/pnl": {
      tags: ["Portfolio"],
      get: {
        summary: "Get realized and unrealized PnL",
        responses: {
          "200": { description: "PnL details" }
        }
      }
    }
  }
};