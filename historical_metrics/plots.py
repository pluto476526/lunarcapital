# milky-way/historical_metrics/plots.py
# pkibuka@milky-way.space


from historical_metrics import utils as ut
import pandas as pd
import numpy as np
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


def compare_mean_and_std(data, tickers_list):
    """
    Compare risk and reward of the stocks using mean and standard deviation of daily returns.
    Returns data formatted for a scatter plot where:
    - x-axis represents risk (standard deviation)
    - y-axis represents reward (mean return)
    Each point represents a stock.
    
    Parameters:
    - data: DataFrame with stock prices (MultiIndex or single level columns)
    - tickers_list: List of tickers to analyze
    
    Returns:
    - Dictionary formatted for scatter plot visualization
    """
    try:
        daily_means = {}
        daily_stds = {}
        available_tickers = []
        missing_tickers = []
        
        for ticker in tickers_list:
            try:
                # Extract close prices based on DataFrame structure
                if isinstance(data.columns, pd.MultiIndex):
                    if (ticker, 'Close') not in data.columns:
                        missing_tickers.append(ticker)
                        continue
                    close_series = data[(ticker, 'Close')]
                else:
                    if f'{ticker}_Close' not in data.columns:
                        missing_tickers.append(ticker)
                        continue
                    close_series = data[f'{ticker}_Close']
                
                # Clean and validate the series
                close_series = pd.to_numeric(close_series, errors='coerce').dropna()
                if len(close_series) < 2:  # Need at least 2 points for returns
                    missing_tickers.append(ticker)
                    continue
                
                # Calculate daily returns
                daily_returns = close_series.pct_change().dropna()
                
                # Calculate daily mean returns (reward)
                mean = daily_returns.mean()
                daily_means[ticker] = mean
                
                # Calculate daily std (risk)
                std = daily_returns.std()
                daily_stds[ticker] = std
                
                available_tickers.append(ticker)
                
            except Exception as e:
                logger.warning(f"Error processing {ticker}: {str(e)}")
                missing_tickers.append(ticker)
                continue

        # Handle case where no tickers were processed
        if not available_tickers:
            logger.error("No valid data calculated for any ticker")
            return None

        # Prepare scatter plot data
        scatter_data = {
            "labels": available_tickers,  # Ticker names for labels
            "datasets": [{
                "label": "Risk vs Reward",
                "data": [
                    {
                        "x": daily_stds[ticker],
                        "y": daily_means[ticker],
                        "r": 10,  # Fixed radius for bubbles
                        "ticker": ticker  # For tooltips
                    } for ticker in available_tickers
                ],
                "backgroundColor": [
                    f"hsl({i * 360 / len(available_tickers)}, 70%, 50%)" 
                    for i in range(len(available_tickers))
                ],
                "borderColor": [
                    f"hsl({i * 360 / len(available_tickers)}, 70%, 30%)" 
                    for i in range(len(available_tickers))
                ],
                "borderWidth": 1
            }],
        }
        
        return scatter_data

    except Exception as e:
        logger.error(f"Error in compare_daily_mean_and_std: {str(e)}", exc_info=True)
        return None



def compare_correlation(data, tickers_list):
    """
    Correlation heatmap data
    Returns data formatted for a plotly.js heatmap
    
    Parameters:
    - data: DataFrame with stock prices (MultiIndex or single level columns)
    - tickers_list: List of tickers to analyze
    
    Returns:
    - Dictionary formatted for heatmap visualization
    """
    try:        
        close_prices = pd.DataFrame()
        available_tickers = []
        missing_tickers = []

        # Extract close prices for each ticker
        for ticker in tickers_list:
            try:
                # Check for ticker in MultiIndex columns (yfinance format)
                if isinstance(data.columns, pd.MultiIndex):
                    if (ticker, 'Close') in data.columns:
                        close_series = data[(ticker, 'Close')]
                    else:
                        missing_tickers.append(ticker)
                        continue
                # Check for single-level columns
                elif f'{ticker}_Close' in data.columns:
                    close_series = data[f'{ticker}_Close']
                else:
                    missing_tickers.append(ticker)
                    continue
                
                # Clean and validate the series
                close_series = pd.to_numeric(close_series, errors='coerce').dropna()
                if len(close_series) > 1:  # Need at least 2 points for correlation
                    close_prices[ticker] = close_series
                    available_tickers.append(ticker)
                else:
                    missing_tickers.append(ticker)
                    
            except Exception as e:
                logger.warning(f"Error processing {ticker}: {str(e)}")
                missing_tickers.append(ticker)
                continue

        # Log missing tickers
        if missing_tickers:
            logger.info(f"Tickers not available: {', '.join(missing_tickers)}")
        
        if len(available_tickers) < 2:
            logger.error("Need at least 2 valid tickers for correlation analysis")
            return None

        # Calculate correlation matrix
        correlation_matrix = close_prices.corr().dropna()
        
        return {
            "correlation_matrix": correlation_matrix.values.tolist(),
            "tickers": available_tickers,
            "metadata": {
                "missing_tickers": missing_tickers,
                "date_range": {
                    "start": str(close_prices.index.min()),
                    "end": str(close_prices.index.max())
                }
            }
        }

    except Exception as e:
        logger.error(f"Error in compare_correlation: {str(e)}", exc_info=True)
        return None



def compare_rsi(data, tickers_list, window=14):
    """
    Calculate RSI for multiple tickers and format data for ECharts visualization.
    
    Parameters:
    - data: DataFrame with stock prices (MultiIndex or single level columns)
    - tickers_list: List of tickers to analyze
    - window: Period for RSI calculation (default=14)
    
    Returns:
    - Dictionary formatted for RSI visualization in ECharts
    """
    try:        
        rsi_data = pd.DataFrame()
        available_tickers = []
        missing_tickers = []

        # Extract close prices and calculate RSI for each ticker
        for ticker in tickers_list:
            try:
                # Check for ticker in MultiIndex columns (yfinance format)
                if isinstance(data.columns, pd.MultiIndex):
                    if (ticker, 'Close') in data.columns:
                        close_series = data[(ticker, 'Close')]
                    else:
                        missing_tickers.append(ticker)
                        continue
                # Check for single-level columns
                elif f'{ticker}_Close' in data.columns:
                    close_series = data[f'{ticker}_Close']
                else:
                    missing_tickers.append(ticker)
                    continue
                
                # Clean and validate the series
                close_series = pd.to_numeric(close_series, errors='coerce').dropna()
                if len(close_series) > window:  # Need enough data points for RSI calculation
                    # Calculate RSI
                    delta = close_series.diff()
                    gain = delta.where(delta > 0, 0)
                    loss = -delta.where(delta < 0, 0)
                    
                    avg_gain = gain.rolling(window=window).mean().dropna()
                    avg_loss = loss.rolling(window=window).mean().dropna()
                    
                    rs = avg_gain / avg_loss
                    rsi = 100 - (100 / (1 + rs))
                    
                    # Only store data from the first valid RSI point
                    rsi_data[ticker] = rsi.dropna()
                    available_tickers.append(ticker)
                else:
                    missing_tickers.append(ticker)
                    
            except Exception as e:
                logger.warning(f"Error processing {ticker}: {str(e)}")
                missing_tickers.append(ticker)
                continue

        # Log missing tickers
        if missing_tickers:
            logger.info(f"Tickers not available or with insufficient data: {', '.join(missing_tickers)}")
        
        if len(available_tickers) == 0:
            logger.error("No valid tickers with sufficient data for RSI calculation")
            return None

        # Prepare data for ECharts
        dates = rsi_data.index.strftime('%Y-%m-%d').tolist()
        series = []
        
        for ticker in available_tickers:
            # Get the valid RSI values (non-null)
            valid_rsi = rsi_data[ticker].dropna()
            series.append({
                "name": ticker,
                "type": "line",
                "data": valid_rsi.round(2).tolist(),
                "symbol": "none",
                "smooth": True,
                # Add start and end indices for this series
                "_startIdx": dates.index(valid_rsi.index[0].strftime('%Y-%m-%d')),
                "_endIdx": dates.index(valid_rsi.index[-1].strftime('%Y-%m-%d'))
            })
        
        return {
            "dates": dates,
            "series": series,
            "metadata": {
                "missing_tickers": missing_tickers,
                "window": window,
                "date_range": {
                    "start": str(rsi_data.index.min()),
                    "end": str(rsi_data.index.max())
                }
            }
        }
    except Exception as e:
        logger.error(f"Error in compare_rsi: {str(e)}", exc_info=True)
        return None



def compare_bollinger_bands(data, tickers_list, window=20, num_std=2):
    """
    Calculate Bollinger Bands for multiple tickers and format data for visualization.
    
    Parameters:
    - data: DataFrame with stock prices (MultiIndex or single level columns)
    - tickers_list: List of tickers to analyze
    - window: Period for moving average (default=20)
    - num_std: Number of standard deviations (default=2)
    
    Returns:
    - Dictionary containing:
        - dates: List of date strings
        - series: Dict of band data per ticker
        - metadata: Calculation parameters and missing tickers
    """
    try:
        result = {
            'dates': [],
            'series': {},
            'metadata': {
                'window': window,
                'num_std': num_std,
                'missing_tickers': []
            }
        }

        # First collect all dates from all tickers
        all_dates = pd.DatetimeIndex([])
        for ticker in tickers_list:
            try:
                # Extract close prices
                if isinstance(data.columns, pd.MultiIndex):
                    close_series = data.get((ticker, 'Close'))
                else:
                    close_series = data.get(f'{ticker}_Close')
                
                if close_series is None:
                    result['metadata']['missing_tickers'].append(ticker)
                    continue
                
                # Clean data
                close_series = pd.to_numeric(close_series, errors='coerce').dropna()
                if len(close_series) < window:
                    result['metadata']['missing_tickers'].append(ticker)
                    continue
                
                # Get all valid dates for this ticker
                rolling_mean = close_series.rolling(window).mean()
                first_valid_idx = rolling_mean.first_valid_index()
                if first_valid_idx is None:
                    result['metadata']['missing_tickers'].append(ticker)
                    continue
                
                ticker_dates = rolling_mean.loc[first_valid_idx:].index
                all_dates = all_dates.union(ticker_dates)
                
            except Exception as e:
                logger.warning(f"Error processing {ticker}: {str(e)}")
                result['metadata']['missing_tickers'].append(ticker)
                continue

        if len(all_dates) == 0:
            logger.error("No valid tickers with sufficient data")
            return None

        # Set the complete date range
        result['dates'] = [d.strftime('%Y-%m-%d') for d in all_dates]
        date_index = {date: idx for idx, date in enumerate(result['dates'])}

        # Now process each ticker against the complete date range
        for ticker in tickers_list:
            if ticker in result['metadata']['missing_tickers']:
                continue
                
            try:
                # Extract close prices again
                if isinstance(data.columns, pd.MultiIndex):
                    close_series = data.get((ticker, 'Close'))
                else:
                    close_series = data.get(f'{ticker}_Close')
                
                close_series = pd.to_numeric(close_series, errors='coerce').dropna()
                
                # Calculate bands
                rolling_mean = close_series.rolling(window).mean()
                rolling_std = close_series.rolling(window).std()
                
                first_valid_idx = rolling_mean.first_valid_index()
                valid_dates = rolling_mean.loc[first_valid_idx:].index
                start_idx = date_index[valid_dates[0].strftime('%Y-%m-%d')]
                
                # Create full-length arrays with None for missing periods
                full_length = len(result['dates'])
                price_data = [None] * full_length
                upper_data = [None] * full_length
                middle_data = [None] * full_length
                lower_data = [None] * full_length
                
                for i, date in enumerate(valid_dates):
                    idx = date_index[date.strftime('%Y-%m-%d')]
                    price_data[idx] = round(close_series[date], 2)
                    upper_data[idx] = round(rolling_mean[date] + num_std * rolling_std[date], 2)
                    middle_data[idx] = round(rolling_mean[date], 2)
                    lower_data[idx] = round(rolling_mean[date] - num_std * rolling_std[date], 2)
                
                result['series'][ticker] = {
                    'price': price_data,
                    'upper': upper_data,
                    'middle': middle_data,
                    'lower': lower_data,
                    '_startIdx': start_idx
                }
                
            except Exception as e:
                logger.warning(f"Error processing {ticker}: {str(e)}")
                result['metadata']['missing_tickers'].append(ticker)
                continue

        result['metadata'].update({
            'start_date': str(all_dates[0]),
            'end_date': str(all_dates[-1])
        })

        return result

    except Exception as e:
        logger.error(f"Error in compare_bollinger_bands: {str(e)}", exc_info=True)
        return None




# def compare_ohlc_data(data, ticker):
#     """
#     Prepare OHLC (Open-High-Low-Close) data for ECharts candlestick chart
    
#     Parameters:
#     - data: DataFrame with stock prices (MultiIndex or single level columns)
#     - ticker: Single ticker symbol to extract data for
    
#     Returns:
#     - Dictionary formatted for ECharts candlestick visualization
#     """
#     try:
#         ohlc_data = []
#         dates = []
#         missing_fields = []
        
#         # Check data structure and extract OHLC data
#         if isinstance(data.columns, pd.MultiIndex):
#             # MultiIndex columns (yfinance format)
#             fields = {
#                 'open': (ticker, 'Open'),
#                 'high': (ticker, 'High'),
#                 'low': (ticker, 'Low'),
#                 'close': (ticker, 'Close'),
#                 'volume': (ticker, 'Volume')
#             }
#         else:
#             # Single-level columns
#             fields = {
#                 'open': f'{ticker}_Open',
#                 'high': f'{ticker}_High',
#                 'low': f'{ticker}_Low',
#                 'close': f'{ticker}_Close',
#                 'volume': f'{ticker}_Volume'
#             }
        
#         # Verify all required fields exist
#         for field, col in fields.items():
#             if col not in data.columns:
#                 missing_fields.append(field)
        
#         if missing_fields:
#             logger.warning(f"Missing fields for {ticker}: {', '.join(missing_fields)}")
#             return None
        
#         # Extract and format the data
#         for date, row in data.iterrows():
#             try:
#                 # ECharts candlestick expects: [open, close, low, high]
#                 ohlc_point = [
#                     float(row[fields['open']]),
#                     float(row[fields['close']]),
#                     float(row[fields['low']]),
#                     float(row[fields['high']])
#                 ]
#                 ohlc_data.append(ohlc_point)
#                 dates.append(str(date.date()))  # Format date as string
#             except (ValueError, TypeError) as e:
#                 logger.warning(f"Skipping invalid data point for {ticker} on {date}: {e}")
#                 continue
        
#         if not ohlc_data:
#             logger.error(f"No valid OHLC data found for {ticker}")
#             return None
        
#         # Prepare volume data if available
#         volume_data = []
#         if fields['volume'] in data.columns:
#             volume_data = [
#                 [i, float(row[fields['volume']])] 
#                 for i, (_, row) in enumerate(data.iterrows())
#                 if not pd.isna(row[fields['volume']])
#             ]
        
#         return {
#             "candlestick": {
#                 "data": ohlc_data,
#                 "dates": dates,
#                 "axisLabel": {
#                     "formatter": '{value}'
#                 }
#             },
#             "volume": {
#                 "data": volume_data
#             },
#             "metadata": {
#                 "ticker": ticker,
#                 "date_range": {
#                     "start": dates[0] if dates else None,
#                     "end": dates[-1] if dates else None
#                 },
#                 "missing_fields": missing_fields
#             }
#         }
    
#     except Exception as e:
#         logger.error(f"Error preparing OHLC data for {ticker}: {str(e)}", exc_info=True)
#         return None




def compare_ohlc_data(data, tickers_list):
    """
    Prepare OHLC data for multiple tickers for comparison in ECharts
    
    Parameters:
    - data: DataFrame with MultiIndex columns (ticker, OHLCV)
    - tickers_list: List of tickers to analyze
    
    Returns:
    - Dictionary formatted for ECharts visualization
    """
    try:
        result = {
            "dates": [],
            "series": [],
            "metadata": {
                "available_tickers": [],
                "missing_tickers": [],
                "missing_fields": {}
            }
        }

        if not isinstance(data.columns, pd.MultiIndex):
            raise ValueError("Data must have MultiIndex columns")

        # Get common date index
        date_index = None
        for ticker in tickers_list:
            try:
                if (ticker, 'Close') in data.columns:
                    close_series = data[(ticker, 'Close')].dropna()
                    if date_index is None:
                        date_index = close_series.index
                    else:
                        date_index = date_index.intersection(close_series.index)
            except Exception as e:
                logger.warning(f"Error processing {ticker}: {str(e)}")
                result["metadata"]["missing_tickers"].append(ticker)
                continue

        if date_index is None or len(date_index) == 0:
            logger.error("No common date index found")
            return None

        result["dates"] = [str(d.date()) for d in date_index]

        for ticker in tickers_list:
            try:
                # Check required fields exist
                required_fields = ['Open', 'High', 'Low', 'Close']
                missing = [
                    field for field in required_fields 
                    if (ticker, field) not in data.columns
                ]
                
                if missing:
                    result["metadata"]["missing_fields"][ticker] = missing
                    logger.warning(f"Missing fields for {ticker}: {missing}")
                    continue

                # Extract OHLC data
                ohlc = data.loc[date_index, ticker]
                ohlc = ohlc[['Open', 'High', 'Low', 'Close']].dropna()
                
                if len(ohlc) == 0:
                    logger.warning(f"No valid data for {ticker}")
                    continue

                # Format for ECharts (array of [open, close, low, high])
                ohlc_data = [
                    [float(o), float(c), float(l), float(h)]
                    for o, h, l, c in zip(
                        ohlc['Open'], ohlc['High'], 
                        ohlc['Low'], ohlc['Close']
                    )
                ]

                result["series"].append({
                    "name": ticker,
                    "type": "candlestick",
                    "data": ohlc_data
                })
                result["metadata"]["available_tickers"].append(ticker)

            except Exception as e:
                logger.error(f"Error processing {ticker}: {str(e)}")
                result["metadata"]["missing_tickers"].append(ticker)
                continue

        if not result["series"]:
            logger.error("No valid series data found")
            return None

        return result

    except Exception as e:
        logger.error(f"Error in compare_ohlc_data: {str(e)}", exc_info=True)
        return None