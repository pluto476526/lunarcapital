// // milky-way/static/historical_data/js/daily_returns_change.js
// // pkibuka@milky-way.space
// // Scatter Chart for risk/reward visualization




document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('meanAndStd').getContext('2d');

  const DEFAULT_COLORS = [
    '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099',
    '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395',
    '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300',
    '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac'
  ];

  if (!window.chart_std || !window.chart_std.datasets) {
    console.error('No chart data available');
    return;
  }

  // Group data by ticker
  const tickerData = {};
  window.chart_std.datasets.forEach(dataset => {
    dataset.data.forEach(point => {
      if (!tickerData[point.ticker]) {
        tickerData[point.ticker] = [];
      }
      tickerData[point.ticker].push(point);
    });
  });

  // Build datasets with distinct colors
  const datasets = Object.keys(tickerData).map((ticker, i) => ({
    label: ticker,
    data: tickerData[ticker],
    backgroundColor: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    borderColor: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    borderWidth: 1,
    pointRadius: 8,
    pointHoverRadius: 10,
    pointStyle: 'circle'
  }));

  const chart = new Chart(ctx, {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Risk vs Reward Analysis',
          font: { size: 18 }
        },
        subtitle: {
          display: true,
          text: 'X: Risk (Standard Deviation), Y: Reward (Mean Daily Return)',
          font: { size: 13, style: 'italic' },
          padding: { bottom: 10 }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const point = context.raw;
              const std = (point.x * 100).toFixed(2) + '%';
              const mean = (point.y * 100).toFixed(2) + '%';
              return [
                `Ticker: ${point.ticker}`,
                `Volatility (Std Dev): ${std}`,
                `Average Daily Return: ${mean}`
              ];
            }
          }
        },
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            padding: 20,
            usePointStyle: true
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Risk (Standard Deviation)',
            font: { weight: 'bold' }
          },
          ticks: {
            callback: v => `${(v * 100).toFixed(1)}%`
          }
        },
        y: {
          title: {
            display: true,
            text: 'Reward (Mean Daily Return)',
            font: { weight: 'bold' }
          },
          ticks: {
            callback: v => `${(v * 100).toFixed(1)}%`
          }
        }
      }
    }
  });

  // Resize observer for responsiveness
  new ResizeObserver(() => {
    ctx.canvas.width = ctx.canvas.offsetWidth;
    ctx.canvas.height = ctx.canvas.offsetHeight;
    chart.resize();
  }).observe(ctx.canvas.parentElement);
});

