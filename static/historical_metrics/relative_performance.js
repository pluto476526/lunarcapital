// milky-way/static/historical_data/js/plots.js
// pkibuka@milky-way.space

document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('relativePerformance').getContext('2d');
  
  // Default colors that work well together and are colorblind-friendly
  const DEFAULT_COLORS = [
    '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', 
    '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395'
  ];
  
  // Check if chart data exists
  if (!window.chart_rp || !window.chart_rp.datasets) {
    console.error('No chart data available');
    return;
  }

  // Create the chart
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: window.chart_rp.labels,
      datasets: window.chart_rp.datasets.map((ds, i) => ({
        label: ds.label,
        data: ds.data,
        fill: false,
        borderColor: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        backgroundColor: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        borderWidth: 2,
        pointRadius: 0, // Remove points for cleaner look with many data points
        pointHoverRadius: 5,
        tension: 0, // Straight lines between points
        borderJoinStyle: 'round',
        cubicInterpolationMode: 'monotone' // Smoother lines
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Compare Relative Performance',
          font: {
            size: 18
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
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
      interaction: {
        mode: 'index',
        axis: 'x',
        intersect: false
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          title: {
            display: true,
            text: 'Price (USD)',
            font: {
              weight: 'bold'
            }
          },
          ticks: {
            callback: function(value) {
              return ((value - 1) * 100).toFixed(1) + '%';
            }
            // return '$' + value.toLocaleString();
            // return ((value - 1) * 100).toFixed(1) + '%';  // Shows "-5.0%" to "+10.0%"
          }
        }
      },
      animation: {
        duration: 1000
      },
      elements: {
        line: {
          borderCapStyle: 'round'
        }
      }
    }
  });

  // Add resize observer to handle container resizing
  new ResizeObserver(() => {
    ctx.canvas.width = ctx.canvas.offsetWidth;
    ctx.canvas.height = ctx.canvas.offsetHeight;
  }).observe(ctx.canvas.parentElement);
});

