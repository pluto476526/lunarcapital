# dash/urls/py

from django.urls import path
from historical_metrics  import views


urlpatterns = [
    path("market-selector/", views.market_selector_view, name="market_selector"),
    path("forex/", views.forex_view, name="forex"),
    path("stocks/", views.stocks_view, name="stocks"),
    path("stocks/results/", views.stock_results_view, name="stock_results"),
    path("crypto/", views.crypto_view, name="crypto"),
]
