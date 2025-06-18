# milky-way/historical_metrics/utils.py
# pkibuka@milky-way.space

from datetime import datetime, timedelta
import yfinance as yf
import pandas as pd
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

def fetch_yfinance_data(tickers: str, start=None, end=None):
    """
    Fetch stock market data from Yahoo Finance
    
    Args:
        tickers (str): Comma-separated string of ticker symbols
        start (str): Start date in YYYY-MM-DD format
        end (str): End date in YYYY-MM-DD format
        
    Returns:
        pd.DataFrame: Multi-level DataFrame with stock data
    """
    try:
        # Clean and validate tickers
        ticker_list = [t.strip().upper() for t in tickers.split(",") if t.strip()]
        if not ticker_list:
            logger.error("No valid tickers provided")
            return pd.DataFrame()
        
        # Set default date range if not provided
        if not end:
            end = datetime.now().strftime('%Y-%m-%d')
        if not start:
            start = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')        

        data = yf.download(
            ticker_list,
            start=start,
            end=end,
            group_by='ticker',
            progress=False,
            threads=True
        )
        
        return data
        
    except Exception as e:
        logger.error(f"Error fetching data: {str(e)}", exc_info=True)
        return pd.DataFrame()

