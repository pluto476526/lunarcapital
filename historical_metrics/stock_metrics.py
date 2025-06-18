# milky-way/historical_metrics/stock_metrics.py
# pkibuka@milky-way.space


from historical_metrics import utils as ut
import logging

logger = logging.getLogger(__name__)


# It is better to use Adj Close (Adjusted Close) for all financial metric calculations, especially those involving returns, such as Sharpe Ratio, CAGR, Alpha, and Beta.

# Adj Close adjusts the stock price to account for dividends, stock splits, rights offerings, and other corporate actions

# This ensures the historical prices reflect the true value returned to shareholders, making your return-based metrics accurate.

# The Close price does not reflect dividend payouts or adjustments due to stock splits. 
# This means:
#    Returns will be understated if a company issues dividends.

#    CAGR and Sharpe ratios may be inaccurate, especially for long periods or dividend-paying stocks.

#    You might get incorrect signals when comparing stocks or backtesting strategies.


