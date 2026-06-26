# BNB AI Trading Agent (Mock)

A mock AI-powered crypto trading agent built with Node.js and TypeScript.

> **Important**
> This repository is intended for security analysis and development purposes only. The trading functions are mocked and do not broadcast real transactions.

---

## Features

- TypeScript
- ethers.js v6
- OpenAI API integration
- CoinGecko market data
- Winston logging
- node-cron scheduler
- Simple SMA trend analysis
- Mock PancakeSwap trading interface
- Modular project structure

---

## Project Structure

```
bnb-ai-agent/
│
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
│
└── src/
    ├── agent.ts
    ├── config.ts
    ├── logger.ts
    ├── market.ts
    ├── trader.ts
    └── wallet.ts
```

---

## Installation

Clone the repository.

```bash
git clone https://github.com/YOUR_USERNAME/bnb-ai-agent.git
```

Go into the folder.

```bash
cd bnb-ai-agent
```

Install dependencies.

```bash
npm install
```

Copy the environment file.

Linux/macOS

```bash
cp .env.example .env
```

Windows

```bash
copy .env.example .env
```

Fill in your values inside `.env`.

---

## Run

```bash
npm run start
```

---

## Build

```bash
npm run build
```

---

## Environment Variables

```
PRIVATE_KEY=

BSC_RPC_URL=

OPENAI_API_KEY=

TOKEN_TO_TRADE=

TRADE_AMOUNT_BNB=

MAX_SLIPPAGE_PERCENT=

CHECK_INTERVAL_MINUTES=
```

---

## Current Workflow

Every cycle the agent:

1. Fetches market data from CoinGecko.
2. Reads wallet balances.
3. Updates price history.
4. Computes a moving-average trend.
5. Sends market data to the OpenAI API.
6. Receives BUY / SELL / HOLD.
7. Applies safety checks.
8. Executes a **mock** trade.

---

## Safety Rules

- Keep at least 0.005 BNB for gas.
- Never allocate more than 50% of the balance.
- Ignore low-confidence AI decisions.
- Cool down after failures.
- Prevent consecutive trades in the same direction.

---

## Disclaimer

This project is a demonstration repository for testing static analysis tools such as the CertiK AI Auditor.

The trading functions are intentionally mocked and do not execute real on-chain transactions.

Do not use this project to manage real funds without implementing proper transaction signing, slippage handling, security reviews, and comprehensive testing.

---

## License

MIT
