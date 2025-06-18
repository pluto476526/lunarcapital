# # milky-way/historical-metrics/forms.py
# # pkibuka@milky-way.space


from django import forms
from django.core.validators import RegexValidator

# Shared Widgets
DATE_WIDGET = forms.DateInput(attrs={'type': 'date', 'class': 'form-control'})
TEXT_WIDGET = forms.TextInput(attrs={'class': 'form-control'})
MULTISELECT_WIDGET = forms.SelectMultiple(attrs={'class': 'form-select'})

# Regex Validators
STOCK_TICKER_VALIDATOR = RegexValidator(
    regex=r'^([A-Z]{1,5})(,\s*[A-Z]{1,5})*$',
    message='Enter stock symbols in uppercase, separated by commas. E.g., AAPL, MSFT, TSLA.'
)

FOREX_TICKER_VALIDATOR = RegexValidator(
    regex=r'^([A-Z]{3}/[A-Z]{3})(,\s*[A-Z]{3}/[A-Z]{3})*$',
    message='Enter currency pairs like EUR/USD, GBP/JPY, separated by commas.'
)

CRYPTO_TICKER_VALIDATOR = RegexValidator(
    regex=r'^([A-Z]{3,5}-[A-Z]{3,5})(,\s*[A-Z]{3,5}-[A-Z]{3,5})*$',
    message='Enter crypto symbols like BTC-USD, ETH-USD, separated by commas.'
)

# Metric Choices
STOCK_METRICS = [
    ('sharpe_ratio', 'Sharpe Ratio'),
    ('max_drawdown', 'Max Drawdown'),
    ('cagr', 'CAGR'),
    ('sortino_ratio', 'Sortino Ratio'),
    ('alpha', 'Alpha'),
    ('beta', 'Beta'),
]

FOREX_METRICS = [
    ('sharpe_ratio', 'Sharpe Ratio'),
    ('max_drawdown', 'Max Drawdown'),
    ('cagr', 'CAGR'),
    ('atr', 'Average True Range (ATR)'),
    ('pip_volatility', 'Pip Volatility'),
    ('currency_correlation', 'Currency Correlation Matrix'),
]

CRYPTO_METRICS = [
    ('sharpe_ratio', 'Sharpe Ratio'),
    ('max_drawdown', 'Max Drawdown'),
    ('cagr', 'CAGR'),
    ('log_returns', 'Log Returns'),
    ('volatility_index', 'Volatility Index'),
]

# Default metric selections
STOCK_DEFAULTS = ['sharpe_ratio', 'max_drawdown', 'cagr', 'alpha', 'beta']
FOREX_DEFAULTS = ['sharpe_ratio', 'max_drawdown', 'atr', 'pip_volatility', 'currency_correlation']
CRYPTO_DEFAULTS = ['sharpe_ratio', 'max_drawdown', 'cagr', 'log_returns', 'volatility_index']

# Base Form with common fields
class BaseMarketForm(forms.Form):
    start_date = forms.DateField(widget=DATE_WIDGET, required=False)
    end_date = forms.DateField(widget=DATE_WIDGET, required=False)

# Stocks Form
class StocksAnalysisForm(BaseMarketForm):
    tickers = forms.CharField(
        label="Stock Tickers",
        validators=[STOCK_TICKER_VALIDATOR],
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g., AAPL, TSLA, MSFT'
        })
    )
    metrics = forms.MultipleChoiceField(
        choices=STOCK_METRICS,
        widget=MULTISELECT_WIDGET,
        label="Select Stock Metrics",
        required=True
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['metrics'].initial = STOCK_DEFAULTS

# Forex Form
class ForexAnalysisForm(BaseMarketForm):
    tickers = forms.CharField(
        label="Currency Pairs",
        validators=[FOREX_TICKER_VALIDATOR],
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g., EUR/USD, GBP/JPY'
        })
    )
    metrics = forms.MultipleChoiceField(
        choices=FOREX_METRICS,
        widget=MULTISELECT_WIDGET,
        label="Select Forex Metrics",
        required=True
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['metrics'].initial = FOREX_DEFAULTS

# Crypto Form
class CryptoAnalysisForm(BaseMarketForm):
    tickers = forms.CharField(
        label="Crypto Symbols",
        validators=[CRYPTO_TICKER_VALIDATOR],
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g., BTC-USD, ETH-USD'
        })
    )
    metrics = forms.MultipleChoiceField(
        choices=CRYPTO_METRICS,
        widget=MULTISELECT_WIDGET,
        label="Select Crypto Metrics",
        required=True
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['metrics'].initial = CRYPTO_DEFAULTS
