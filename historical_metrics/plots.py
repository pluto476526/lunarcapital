# milky-way/historical_metrics/plots.py
# pkibuka@milky-way.space


from historical_metrics import utils as ut
import pandas as pd
import logging

logger = logging.getLogger(__name__)


def compare_relative_performance(data, tickers_list):
    """
    Prepare normalized performance data with robust handling of missing tickers.
    
    Returns:
    - dict: Chart-ready data with available tickers only
    - None: If no valid data exists
    """
    try:
        logger.debug("DataFrame head:\n%s", data.head(5).to_string())
        
        close_prices = pd.DataFrame()
        available_tickers = []
        missing_tickers = []

        # Handle different data formats
        for ticker in tickers_list:
            try:
                # Check for ticker in MultiIndex columns (yfinance format)
                if isinstance(data.columns, pd.MultiIndex):
                    if (ticker, 'Close') in data.columns:
                        close_series = data[(ticker, 'Close')].dropna()
                    else:
                        missing_tickers.append(ticker)
                        continue
                        
                close_series = pd.to_numeric(close_series, errors='coerce').dropna()
                if len(close_series) > 0:
                    close_prices[ticker] = close_series / close_series.iloc[0]
                    available_tickers.append(ticker)
                    
            except Exception as e:
                logger.warning(f"Error processing {ticker}: {str(e)}")
                missing_tickers.append(ticker)
                continue

        # Log missing tickers
        if missing_tickers:
            logger.info(f"Tickers not available: {', '.join(missing_tickers)}")
        
        if close_prices.empty:
            logger.error("No valid data available for any ticker")
            return None

        # Find common date range (if multiple tickers)
        if len(available_tickers) > 1:
            close_prices = close_prices.dropna(how='any')

        # Prepare chart data
        chart_data = {
            "labels": close_prices.index.strftime('%Y-%m-%d').tolist(),
            "datasets": [
                {
                    "label": ticker,
                    "data": close_prices[ticker].tolist(),
                    "borderColor": f"hsl({i * 360 / len(available_tickers)}, 70%, 50%)",
                    "backgroundColor": f"hsla({i * 360 / len(available_tickers)}, 70%, 50%, 0.1)",
                    "borderWidth": 2,
                    "tension": 0.1,
                    "fill": False
                }
                for i, ticker in enumerate(available_tickers)
            ],
        }

        return chart_data

    except Exception as e:
        logger.error(f"Error in compare_relative_performance: {str(e)}", exc_info=True)
        return None




def calculate_daily_returns_change(data, tickers_list):
    """
    Calculates percentage change in daily returns with robust error handling.
    
    Args:
        data: DataFrame containing stock price data (MultiIndex or regular)
        tickers_list: List of ticker symbols to analyze
        
    Returns:
        Dictionary containing:
        - labels: List of dates
        - datasets: List of return series
        - metadata: Info about available/missing tickers
        or None if no valid data exists
    """
    try:
        logger.debug("DataFrame head:\n%s", data.head(5).to_string())
        
        daily_returns = pd.DataFrame()
        available_tickers = []
        missing_tickers = []
        date_warnings = []

        for ticker in tickers_list:
            try:
                # Extract close prices based on DataFrame structure
                if isinstance(data.columns, pd.MultiIndex):
                    if (ticker, 'Close') not in data.columns:
                        missing_tickers.append(ticker)
                        continue
                    close_series = data[(ticker, 'Close')]
            
                
                # Clean and validate the series
                close_series = pd.to_numeric(close_series, errors='coerce').dropna()
                if len(close_series) < 2:  # Need at least 2 points for returns
                    missing_tickers.append(ticker)
                    continue
                
                # Calculate daily returns with validation
                returns = close_series.pct_change().dropna()
                if len(returns) == 0:
                    missing_tickers.append(ticker)
                    continue
                
                daily_returns[ticker] = returns
                available_tickers.append(ticker)
                
            except Exception as e:
                logger.warning(f"Error processing {ticker}: {str(e)}")
                missing_tickers.append(ticker)
                continue

        # Handle empty results
        if daily_returns.empty:
            logger.error("No valid daily returns calculated for any ticker")
            return None

        # Find common date range (drop dates with any missing values)
        daily_returns = daily_returns.dropna(how='any')
        
        # Log date alignment issues
        if len(available_tickers) > 1 and daily_returns.shape[0] == 0:
            logger.warning("No overlapping dates with valid returns across all tickers")
            return None

        # Prepare dates - handle various index types
        try:
            dates = pd.to_datetime(daily_returns.index).strftime('%Y-%m-%d').tolist()
        except Exception as e:
            logger.warning(f"Date formatting error: {str(e)} - using raw index values")
            dates = daily_returns.index.astype(str).tolist()

        # Prepare chart data with metadata
        chart_data = {
            "labels": dates,
            "datasets": [
                {
                    "label": ticker,
                    "data": daily_returns[ticker].tolist(),
                    "borderColor": f"hsl({i * 360 / len(available_tickers)}, 70%, 50%)",
                    "backgroundColor": f"hsla({i * 360 / len(available_tickers)}, 70%, 50%, 0.1)",
                    "borderWidth": 2,
                    "tension": 0.1,
                    "fill": False,
                    "pointRadius": 0,
                    "borderJoinStyle": 'round'
                }
                for i, ticker in enumerate(available_tickers)
            ],
        }
        
        return chart_data

    except Exception as e:
        logger.error(f"Error in calculate_daily_returns_change: {str(e)}", exc_info=True)
        return None





# def compare_relative_performance(data, tickers_list):
#     """
#     Prepare data for Chart.js plotting from various data formats including:
#     - yfinance multi-index format
#     - Single stock with prefixed columns
#     - CSV wide format with repeated tickers

#     The normalization approach makes it much easier to compare the relative
#     performance of different stocks, as they'll all start from the same baseline point.
#     """
#     try:
#         if data.empty:
#             logger.error("Empty DataFrame received")
#             return None

#         logger.debug("DataFrame head:\n%s", data.head(5).to_string())

#         # Handle multi-index columns (from yfinance)
#         if isinstance(data.columns, pd.MultiIndex):
#             close_prices = pd.DataFrame()
#             for ticker in tickers_list:
#                 if (ticker, 'Close') in data.columns:
#                     close_series = data[(ticker, 'Close')].dropna()
#                     if not close_series.empty:
#                         close_prices[ticker] = close_series / close_series.iloc[0] # normalize data
        
#         close_prices = close_prices.dropna()

#         chart_data = {
#             "labels": close_prices.index.strftime('%Y-%m-%d').tolist(),
#             "datasets": [
#                 {
#                     "label": ticker,
#                     "data": close_prices[ticker].dropna().tolist(),
#                     "borderColor": f"hsl({i * 360 / len(tickers_list)}, 70%, 50%)",
#                     "backgroundColor": f"hsla({i * 360 / len(tickers_list)}, 70%, 50%, 0.1)",
#                     "borderWidth": 2,
#                     "tension": 0.1,
#                     "fill": False
#                 }
#                 for i, ticker in enumerate(tickers_list)
#                 if ticker in close_prices.columns
#             ]
#         }

#         return chart_data

#     except Exception as e:
#         logger.error(f"Error in compare_stocks: {str(e)}", exc_info=True)
#         return None




# def calculate_daily_returns_change(data, tickers_list):
#     """
#     Calculates percentage change in daily returns and prepares data for visualization
    
#     Args:
#         data: DataFrame containing stock price data
#         tickers_list: List of ticker symbols to analyze
        
#     Returns:
#         Dictionary containing chart-ready data for daily returns visualization
#         or None if error occurs
#     """
#     try:
#         logger.debug("DataFrame head:\n%s", data.head(5).to_string())
        
#         daily_returns = pd.DataFrame()  # Store all daily returns here
#         chart_data = {
#             "labels": [],
#             "datasets": []
#         }

#         # Handle multi-index columns (from yfinance)
#         if isinstance(data.columns, pd.MultiIndex):
#             for ticker in tickers_list:
#                 if (ticker, 'Close') in data.columns:
#                     close_series = data[(ticker, 'Close')].dropna()
#                     if not close_series.empty:
#                         # Convert to numeric and calculate daily returns
#                         close_series = pd.to_numeric(close_series, errors='coerce')
#                         returns = close_series.pct_change().dropna()
#                         daily_returns[ticker] = returns
        
#         daily_returns = daily_returns.dropna()
        
#         if daily_returns.empty:
#             logger.error("No valid daily returns calculated")
#             return None

#         # Prepare chart data
#         chart_data["labels"] = daily_returns.index.strftime('%Y-%m-%d').tolist()
        
#         for i, ticker in enumerate(daily_returns.columns):
#             chart_data["datasets"].append({
#                 "label": ticker,
#                 "data": daily_returns[ticker].tolist(),
#                 "borderColor": f"hsl({i * 360 / len(tickers_list)}, 70%, 50%)",
#                 "backgroundColor": f"hsla({i * 360 / len(tickers_list)}, 70%, 50%, 0.1)",
#                 "borderWidth": 2,
#                 "tension": 0.1,
#                 "fill": False,
#                 "pointRadius": 0,  # Hide points for cleaner look
#                 "borderJoinStyle": 'round'
#             })

#         logger.debug("Successfully calculated daily returns for %d tickers", len(daily_returns.columns))
#         return chart_data

#     except Exception as e:
#         logger.error(f"Error in calculate_daily_returns_change: {str(e)}", exc_info=True)
#         return None
