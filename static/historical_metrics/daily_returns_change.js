// milky-way/static/historical_data/js/daily_returns_change.js
// pkibuka@milky-way.space


// document.addEventListener('DOMContentLoaded', () => {
//   const canvas = document.getElementById('dailyReturnsChange');
//   if (!canvas) return console.error('Canvas element not found');

//   const ctx = canvas.getContext('2d');
//   if (!ctx) return console.error('Canvas context not found');

//   if (!window.chart_drc || !window.chart_drc.labels || !window.chart_drc.datasets)
//     return console.error('Chart data is incomplete');

//   const COLOR_PALETTE = [
//     '#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F',
//     '#EDC948', '#B07AA1', '#FF9DA7', '#9C755F', '#BAB0AC'
//   ];

//   const config = {
//     type: 'line',
//     data: {
//       labels: window.chart_drc.labels,
//       datasets: window.chart_drc.datasets.map((dataset, i) => ({
//         label: dataset.label,
//         data: dataset.data.map(val => val * 100), // Convert to percentage
//         borderColor: COLOR_PALETTE[i % COLOR_PALETTE.length],
//         backgroundColor: COLOR_PALETTE[i % COLOR_PALETTE.length] + '33',
//         fill: false,
//         tension: 0.3,
//         borderWidth: 2,
//         pointRadius: 0,
//         pointHoverRadius: 4
//       }))
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       interaction: {
//         mode: 'index',
//         intersect: false
//       },
//       stacked: false,
//       plugins: {
//         title: {
//           display: true,
//           text: 'Daily Returns Trend',
//           font: {
//             size: 18,
//             weight: 'bold'
//           },
//           color: '#333'
//         },
//         legend: {
//           position: 'top',
//           labels: {
//             font: {
//               size: 12
//             }
//           }
//         },
//         tooltip: {
//           callbacks: {
//             label: context => {
//               const val = context.parsed.y;
//               return `${context.dataset.label}: ${val.toFixed(2)}%`;
//             }
//           }
//         }
//       },
//       scales: {
//         x: {
//           title: {
//             display: true,
//             text: 'Date',
//             color: '#555'
//           },
//           ticks: {
//             color: '#666',
//             maxRotation: 45,
//             minRotation: 30,
//             autoSkip: true
//           },
//           grid: {
//             display: false
//           }
//         },
//         y: {
//           title: {
//             display: true,
//             text: 'Return (%)',
//             color: '#555'
//           },
//           ticks: {
//             color: '#666',
//             callback: value => value.toFixed(1) + '%'
//           },
//           grid: {
//             color: 'rgba(0,0,0,0.05)'
//           }
//         }
//       }
//     }
//   };

//   const chart = new Chart(ctx, config);

//   // Responsive resize observer (optional)
//   new ResizeObserver(() => chart.resize()).observe(canvas.parentElement);
// });



document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('dailyReturnsChange');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get canvas context');
    return;
  }

  if (!window.chart_drc || !window.chart_drc.labels || !window.chart_drc.datasets) {
    console.error('Missing chart data');
    return;
  }

  const COLOR_PALETTE = [
    '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099',
    '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395',
    '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300'
  ];

  const datasets = window.chart_drc.datasets.map((dataset, i) => ({
    label: dataset.label,
    data: dataset.data.map(val => val * 100),
    borderColor: COLOR_PALETTE[i % COLOR_PALETTE.length],
    backgroundColor: COLOR_PALETTE[i % COLOR_PALETTE.length] + '33',
    borderWidth: 2,
    tension: 0.35,
    pointRadius: 0,
    pointHoverRadius: 5,
    fill: false
  }));

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: window.chart_drc.labels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Daily Return Trends',
          font: {
            size: 18
          },
          color: '#333'
        },
        subtitle: {
          display: true,
          text: 'Track how returns evolve over time',
          font: {
            size: 13,
            style: 'italic'
          },
          padding: { bottom: 10 }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: context => {
              const val = context.parsed.y;
              return `${context.dataset.label}: ${val.toFixed(2)}%`;
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
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date',
            font: { weight: 'bold' }
          },
          ticks: {
            color: '#444',
            maxRotation: 45,
            minRotation: 30,
            autoSkip: true
          },
          grid: {
            color: 'rgba(0,0,0,0.05)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Return (%)',
            font: { weight: 'bold' }
          },
          ticks: {
            callback: v => `${v.toFixed(1)}%`,
            color: '#444'
          },
          grid: {
            color: 'rgba(0,0,0,0.05)'
          }
        }
      }
    }
  });

  new ResizeObserver(() => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    chart.resize();
  }).observe(canvas.parentElement);
});

