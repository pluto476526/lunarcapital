# milky-way/historical_metrics/views.py
# pkibuka@milky-way.space

from django.shortcuts import render, redirect
from django.core import serializers
from historical_metrics.forms import StocksAnalysisForm, ForexAnalysisForm, CryptoAnalysisForm
from historical_metrics import utils as ut
from historical_metrics import plots as pl
import logging, json

logger = logging.getLogger(__name__)


def market_selector_view(request):
    context = {}
    return render(request, "historical_metrics/market_selector.html", context)


def forex_view(request):
    f_form = ForexAnalysisForm(request.POST or None)
    
    if request.method == 'POST' and f_form.is_valid():
        pass

    context = {
        "f_form": f_form,
    }
    return render(request, "historical_metrics/forex.html", context)


def stocks_view(request):
    s_form = StocksAnalysisForm(request.POST or None)
    
    if request.method == 'POST' and s_form.is_valid():
        tickers = request.POST.get("tickers")
        start_date = request.POST.get("start_date")
        end_date = request.POST.get("end_date")
        metrics = request.POST.getlist("metrics")
        
        data = ut.fetch_yfinance_data(tickers, start_date, end_date)
        tickers_list = [t.strip() for t in tickers.split(",")]
        
        chart_rp = pl.compare_relative_performance(data, tickers_list)
        chart_drc = pl.calculate_daily_returns_change(data, tickers_list)
        chart_std = pl.compare_mean_and_std(data, tickers_list)
        chart_cr = pl.compare_correlation(data, tickers_list)
        
        # chat_dd = pl.compare_drawdowns(data, tickers_list)
        chart_rsi = pl.compare_rsi(data, tickers_list, 14)
        chart_bb = pl.compare_bollinger_bands(data, tickers_list)

        # Store in session
        request.session['chart_rp'] = chart_rp
        request.session['chart_drc'] = chart_drc
        request.session['chart_std'] = chart_std
        request.session["chart_cr"] = chart_cr
        request.session["chart_rsi"] = chart_rsi
        request.session["chart_bb"] = chart_bb

        return redirect("stock_results")
    
    return render(request, "historical_metrics/stocks.html", {"s_form": s_form})


def stock_results_view(request):
    # Retrieve from session and remove it
    chart_rp = request.session.pop("chart_rp", None)
    chart_drc = request.session.pop("chart_drc", None)
    chart_std = request.session.pop("chart_std", None)
    chart_cr = request.session.pop("chart_cr", None)
    chart_rsi = request.session.pop("chart_rsi", None)
    chart_bb = request.session.pop("chart_bb", None)
    # if not chart_data:
    #     return redirect("stocks")
    
    context = {
        "chart_rp": chart_rp,
        "chart_drc": chart_drc,
        "chart_std": chart_std,
        "chart_cr": chart_cr,
        "chart_rsi": chart_rsi,
        "chart_bb": chart_bb,
    }
    return render(request, "historical_metrics/stock_results.html", context)


def crypto_view(request):
    c_form = CryptoAnalysisForm(request.POST or None)
    
    if request.method == 'POST' and c_form.is_valid():
        # Process stock data...
        pass

    context = {
        "c_form": c_form,
    }
    return render(request, "historical_metrics/crypto.html", context)
