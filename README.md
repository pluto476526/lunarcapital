# 🚀 Lunar Capital Backtester

**Domain:** [milky-way.space](https://milky-way.space)  
An automated investment analytics platform that empowers users to design, test, and evaluate portfolio strategies using historical financial data.

---

## 🌌 Overview

Milky-Way Analytics is a platform designed for novice and professional investors. It allows users to analyze historical data through graphs, and simulate portfolio performance using custom or predefined investment strategies. Through robust analytics, users can understand expected returns, risk, drawdowns, and overall strategy viability before deploying real capital.

---

## 🔧 Features

### 👤 User & Account Management
- Secure registration, login, logout
- Profile customization (timezone, defaults)
- Tiered access plans (Free, Pro, Institutional)
- User-specific strategy storage and visibility

### 🧠 Strategy Design
- Form-based strategy builder (JSON or pseudo-code)
- Visual editor (optional, future)
- Support for:
  - Technical indicators: SMA, EMA, RSI, MACD
  - Price-based logic
  - Custom user-defined rules
- Prebuilt templates: Golden Cross, Momentum, Mean Reversion

### 📚 Market Data Integration
- Support for stocks, ETFs, crypto, forex, and CSV uploads
- Integration-ready (Yahoo Finance, Alpha Vantage, Polygon)
- Resampling and date range filtering

### 🔁 Backtesting
- Uses Backtesting library
- Event-driven or vectorized simulation core
- Simulates trades, positions, portfolio evolution
- Capital allocation, fees, slippage
- Long/short support

#### ✅ Key Metrics Computed
- Total Return, CAGR
- Sharpe & Sortino Ratios
- Max Drawdown
- Win Rate, Exposure
- Trade log and position chart

### 📈 Reporting & Visualization
- Equity curve plot
- Drawdown and volatility graphs
- Monthly/Annual returns heatmap
- Strategy vs benchmark comparison
- Exportable CSV/PDF of trades & results

### ⚙️ Strategy Optimization
- Grid search for parameter sweeps
- Walk-forward analysis
- Monte Carlo simulations
- Out-of-sample validation

### 📦 Portfolio Backtesting
- Multi-asset strategy support
- Custom rebalancing logic
- Risk budgeting & capital allocation

### ⚡ Optional Execution Features
- Live signal generation from strategies
- Paper trading support
- Broker integrations (Alpaca, IBKR)

---

## 🧱 Tech Stack

- **Backend:** Django, DRF, Celery, Redis
- **Frontend:** Django Templates
- **Database:** PostgreSQL
- **Task Queue:** Celery + Redis (for async backtesting)
- **Data Sources:** CSV, or plug-in APIs (Yahoo, Alpha Vantage)

---



