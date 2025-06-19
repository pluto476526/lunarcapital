// milky-way/static/historical_data/js/daily_returns_change.js
// pkibuka@milky-way.space
// Scatter Chart for risk/reward visualization




document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('meanAndStd').getContext('2d');
  
  const DEFAULT_COLORS = [
    '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', 
    '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395',
    '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300',
    '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac'
  ];

  if (!window.chart_drc) {
    console.error('No chart data available');
    return;
  }

  // Group data by ticker to create separate datasets
  const tickerData = {};
  window.chart_std.datasets.forEach(dataset => {
    dataset.data.forEach(point => {
      if (!tickerData[point.ticker]) {
        tickerData[point.ticker] = [];
      }
      tickerData[point.ticker].push(point);
    });
  });

  // Create datasets array with unique colors per ticker
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
        tooltip: {
          callbacks: {
            label: function(context) {
              const point = context.raw;
              return [
                `Ticker: ${point.ticker}`,
                `Risk (Std Dev): ${(point.x * 100).toFixed(2)}%`,
                `Reward (Mean Return): ${(point.y * 100).toFixed(2)}%`
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
          ticks: { callback: v => `${(v * 100).toFixed(1)}%` }
        },
        y: {
          title: { 
            display: true, 
            text: 'Reward (Mean Return)',
            font: { weight: 'bold' }
          },
          ticks: { callback: v => `${(v * 100).toFixed(1)}%` }
        }
      }
    }
  });

  // Handle resizing
  new ResizeObserver(() => {
    ctx.canvas.width = ctx.canvas.offsetWidth;
    ctx.canvas.height = ctx.canvas.offsetHeight;
    chart.resize();
  }).observe(ctx.canvas.parentElement);
});




// document.addEventListener('DOMContentLoaded', () => {
//   const ctx = document.getElementById('meanAndStd').getContext('2d');
  
//   // Color palette matching your preferred style
//   const DEFAULT_COLORS = [
//     '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', 
//     '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395',
//     '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300',
//     '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac'
//   ];

//   if (!window.chart_std) {
//     console.error('No chart data available');
//     return;
//   }

//   // Create the scatter chart with your preferred legend style
//   const chart = new Chart(ctx, {
//     type: 'scatter',
//     data: {
//       datasets: window.chart_std.datasets.map((dataset, i) => ({
//         label: dataset.label,
//         data: dataset.data,
//         backgroundColor: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
//         borderColor: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
//         borderWidth: 1,
//         pointRadius: 8,
//         pointHoverRadius: 10,
//         pointStyle: 'circle'
//       }))
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         title: {
//           display: true,
//           text: 'Risk vs Reward Analysis',
//           font: { size: 18 }
//         },
//         tooltip: {
//           callbacks: {
//             label: function(context) {
//               const point = context.raw;
//               return [
//                 `Ticker: ${point.ticker}`,
//                 `Risk (Std Dev): ${(point.x * 100).toFixed(2)}%`,
//                 `Reward (Mean Return): ${(point.y * 100).toFixed(2)}%`
//               ];
//             }
//           }
//         },
//         legend: {
//           position: 'top',
//           labels: {
//             boxWidth: 12,
//             padding: 20,
//             usePointStyle: true,
//             generateLabels: function(chart) {
//               const data = chart.data;
//               return data.datasets.map((dataset, i) => ({
//                 text: dataset.label,
//                 fillStyle: dataset.backgroundColor,
//                 strokeStyle: dataset.borderColor,
//                 lineWidth: 1,
//                 pointStyle: dataset.pointStyle,
//                 hidden: !chart.isDatasetVisible(i),
//                 index: i
//               }));
//             }
//           },
//           onClick: function(e, legendItem, legend) {
//             const index = legendItem.index;
//             const chart = legend.chart;
//             const meta = chart.getDatasetMeta(index);

//             // Toggle visibility
//             meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;

//             // Update the chart
//             chart.update();
//           }
//         }
//       },
//       scales: {
//         x: {
//           title: { 
//             display: true, 
//             text: 'Risk (Standard Deviation of Daily Returns)',
//             font: { 
//               weight: 'bold',
//             }
//           },
//           ticks: {
//             callback: function(value) {
//               return (value * 100).toFixed(1) + '%';
//             }
//           },
//           grid: {
//             color: 'rgba(0, 0, 0, 0.1)'
//           }
//         },
//         y: {
//           title: { 
//             display: true, 
//             text: 'Reward (Mean Daily Return)',
//             font: { 
//               weight: 'bold',
//             }
//           },
//           ticks: {
//             callback: function(value) {
//               return (value * 100).toFixed(1) + '%';
//             }
//           },
//           grid: {
//             color: 'rgba(0, 0, 0, 0.1)'
//           }
//         }
//       },
//       elements: {
//         point: {
//           hoverBorderWidth: 2
//         }
//       },
//       interaction: {
//         intersect: false,
//         mode: 'point'
//       }
//     }
//   });

//   // Add resize observer
//   new ResizeObserver(() => {
//     ctx.canvas.width = ctx.canvas.offsetWidth;
//     ctx.canvas.height = ctx.canvas.offsetHeight;
//     chart.resize();
//   }).observe(ctx.canvas.parentElement);
// });