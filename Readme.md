# PnL Trade Service

This project is a simple backend service that records trades and calculates portfolio holdings along with realized and unrealized profit and loss (PnL).

The service is designed for a single user, keeps all data in memory, and focuses on correctness of trade flows and PnL calculations rather than persistence or authentication.

---

## What the Service Does

- Allows adding buy and sell trades
- Maintains current holdings per symbol
- Calculates:
  - Realized PnL from closed trades
  - Unrealized PnL from open positions using latest prices
- Uses the **average cost method** for PnL calculation
- Exposes REST APIs with interactive Swagger documentation

Latest prices are hardcoded:
- BTC = 40,000
- ETH = 2,000

---

## Tech Stack
- Node.js
- Express
- TypeScript
- Zod
- Jest + Supertest
- Swagger (OpenAPI)
- Docker


## PnL Calculation Logic (Average Cost)

- **Buy trade**
  - New quantity = old quantity + buy quantity  
  - **New average entry price**  
    ```ini
    avg = (oldQty × oldAvg + buyQty × buyPrice) / (oldQty + buyQty)
    ```

- **Sell trade**
  - Quantity decreases by sell quantity  
  - **Realized PnL**  
    ```ini
    (sellPrice − avgEntryPrice) × sellQty
    ```
  - Average entry price remains unchanged

- **Unrealized PnL**
    ```ini
    (latestPrice − avgEntryPrice) × currentQuantity
    ```
---

## Running the Service Using Docker

1. Build the Docker image:
```bash
docker build -t trade-service .
```

2. Run the container:
```bash
docker run -p 3000:3000 trade-service
```

3. Server runs on: http://localhost:3000


## Running the Service without Docker

1. Install dependencies:
```bash
npm install
```
2. Start the server:
```bash
npm run dev
```

3. Server runs on: http://localhost:3000

## API Documentation (Swagger)

Swagger UI is available at: http://localhost:3000/api/docs

You can use it to:
- Explore all available endpoints
- View request and response formats
- Send test requests directly from the browser

## API Descriptions

### Add a Trade

POST `/api/trades`

Request body:
```json
{
  "symbol": "BTC",
  "side": "buy",
  "price": 40000,
  "quantity": 1
}
```

### Get Portfolio

GET `/api/portfolio`

Example response:
```json
[
  {
    "symbol": "BTC",
    "quantity": 2,
    "avgEntryPrice": 41000
  }
]
```

### Get PnL

GET `/api/portfolio/pnl`

Example response:
```json
{
  "realizedPnL": 2000,
  "unrealizedPnL": 3000,
  "totalPnL": 5000
}
```

### Get All Trades

GET `/api/trades`

Example response:
```json
[
  {
    "id": "f11cf7a4-3efe-48b6-93d4-286a0496d70f", // uuid v4
    "symbol": "BTC",
    "side": "buy",
    "price": 40000,
    "quantity": 1,
    "timestamp": "2026-02-03T09:00:15.183Z"
  }
]
```

## Testing

This project includes integration tests for trade flow and PnL calculation using Jest and Supertest.

What is tested
- Buy and sell trades
- Average price calculation
- Realized and unrealized PnL

Run tests

```bash
npm run test
```

