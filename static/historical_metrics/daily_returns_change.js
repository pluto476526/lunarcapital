// milky-way/static/historical_data/js/daily_returns_change.js
// pkibuka@milky-way.space
// Histogram for daily returns visualization

// document.addEventListener('DOMContentLoaded', () => {
//   const ctx = document.getElementById('dailyReturnsChange').getContext('2d');
  
//   // Default colors that work well together and are colorblind-friendly
//   const DEFAULT_COLORS = [
//     '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', 
//     '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395'
//   ];
  
//   // Check if chart data exists
//   if (!window.chart_drc || !window.chart_drc.datasets) {
//     console.error('No chart data available');
//     return;
//   }

//   // Create the histogram chart
//   new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: window.chart_drc.labels,
//       datasets: window.chart_drc.datasets.map((ds, i) => ({
//         label: ds.label,
//         data: ds.data,
//         backgroundColor: DEFAULT_COLORS[i % DEFAULT_COLORS.length] + '80', // Add transparency
//         borderColor: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
//         borderWidth: 1,
//         borderRadius: 2, // Slightly rounded corners
//         barPercentage: 0.8, // Controls bar width
//         categoryPercentage: 0.9 // Controls group spacing
//       }))
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         title: {
//           display: true,
//           text: 'Daily Returns Distribution',
//           font: {
//             size: 18
//           }
//         },
//         tooltip: {
//           mode: 'index',
//           intersect: false,
//           callbacks: {
//             label: function(context) {
//               return `${context.dataset.label}: ${(context.parsed.y * 100).toFixed(2)}%`;
//             }
//           }
//         },
//         legend: {
//           position: 'top',
//           labels: {
//             boxWidth: 12,
//             padding: 20,
//             usePointStyle: true
//           }
//         }
//       },
//       interaction: {
//         mode: 'index',
//         axis: 'x',
//         intersect: false
//       },
//       scales: {
//         x: {
//           title: {
//             display: true,
//             text: 'Date',
//             font: {
//               weight: 'bold'
//             }
//           },
//           grid: {
//             display: false
//           },
//           stacked: false // Change to true for stacked histogram
//         },
//         y: {
//           title: {
//             display: true,
//             text: 'Daily Return (%)',
//             font: {
//               weight: 'bold'
//             }
//           },
//           ticks: {
//             callback: function(value) {
//               return (value * 100).toFixed(0) + '%';
//             }
//           },
//           min: -0.1, // Adjust based on your data range
//           max: 0.1   // Adjust based on your data range
//         }
//       },
//       animation: {
//         duration: 1000
//       }
//     }
//   });

//   // Add resize observer to handle container resizing
//   new ResizeObserver(() => {
//     ctx.canvas.width = ctx.canvas.offsetWidth;
//     ctx.canvas.height = ctx.canvas.offsetHeight;
//   }).observe(ctx.canvas.parentElement);
// });




document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('dailyReturnsChange').getContext('2d');
  
  // Default colors with better visibility for dense data
  const DEFAULT_COLORS = [
    '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', 
    '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395'
  ];
  
  if (!window.chart_drc || !window.chart_drc.datasets) {
    console.error('No chart data available');
    return;
  }

  // Data preprocessing for large datasets
  const isLargeDataset = window.chart_drc.labels.length > 1000;
  const displayData = isLargeDataset ? 
    preprocessLargeData(window.chart_drc) : 
    window.chart_drc;

  // Create the optimized histogram chart
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: displayData.labels,
      datasets: displayData.datasets.map((ds, i) => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: DEFAULT_COLORS[i % DEFAULT_COLORS.length] + (isLargeDataset ? '40' : '80'),
        borderColor: isLargeDataset ? 'transparent' : DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        borderWidth: isLargeDataset ? 0 : 1,
        borderRadius: 2,
        barPercentage: isLargeDataset ? 1.0 : 0.8,
        categoryPercentage: isLargeDataset ? 1.0 : 0.9,
        pointRadius: 0,
        pointHoverRadius: 5
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Daily Returns Distribution' + (isLargeDataset ? ' (Aggregated)' : ''),
          font: { size: 18 }
        },
        tooltip: {
          mode: 'nearest',
          intersect: false,
          callbacks: {
            label: (context) => {
              const returnValue = context.parsed.y; // or context.raw depending on your data structure
              const percentageDisplay = (returnValue * 100).toFixed(2) + '%';
              const countInfo = isLargeDataset ? ` (${context.raw?.count || 1} days)` : '';
              return `${context.dataset.label}: ${percentageDisplay}${countInfo}`;
            },
            // If you need to format the title (date display)
            title: (context) => {
                return context[0].label; // The date or bin range
            }
            // label: (context) => {
            //   const value = context.parsed.y;
            //   return `${context.dataset.label}: ${(value * 100).toFixed(2)}%` + 
            //     (isLargeDataset ? ` (${context.raw?.count || 1} occurrences)` : '');
            // }
          }
        },
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            padding: 20,
            usePointStyle: true
          }
        },
        zoom: isLargeDataset ? {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'xy'
          },
          pan: {
            enabled: true,
            mode: 'xy'
          }
        } : undefined
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
            text: isLargeDataset ? 'Daily Return Range (%)' : 'Trading Date',
            font: { 
              weight: 'bold',
            }
          },
          grid: { display: false },
          ticks: {
            autoSkip: true,
            maxRotation: 0,
            maxTicksLimit: isLargeDataset ? 10 : 20
          }
        },
        y: {
          title: { 
            display: true, 
            text: isLargeDataset ? 'Frequency' : 'Returns',
            font: { 
              weight: 'bold',
            }
          },
          ticks: {
            // For aggregated data (counts), show raw values
            // For raw returns, show percentages
            callback: (value) => isLargeDataset ? value : `${(value * 100).toFixed(1)}%`
          },
          beginAtZero: true
        }
      },
      animation: {
        duration: isLargeDataset ? 0 : 1000 // Disable animation for large datasets
      }
    }
  });

  // Add resize observer
  new ResizeObserver(() => {
    ctx.canvas.width = ctx.canvas.offsetWidth;
    ctx.canvas.height = ctx.canvas.offsetHeight;
    chart.resize();
  }).observe(ctx.canvas.parentElement);

  // Optimized large dataset preprocessor for daily returns
  function preprocessLargeData(rawData) {
      try {
          // Validate input
          if (!rawData?.datasets?.length) {
              console.error('Invalid input data');
              return { labels: [], datasets: [] };
          }

          // Calculate optimal bin count (between 20-50 bins)
          const dataLength = rawData.labels.length;
          const binCount = Math.max(20, Math.min(50, Math.floor(dataLength / 20)));
          
          const processed = { 
              labels: [], 
              datasets: [],
              binSize: (1 / binCount).toFixed(4)
          };

          // Calculate global min/max across all datasets for consistent binning
          const allValues = rawData.datasets.flatMap(d => d.data);
          const globalMin = Math.min(...allValues);
          const globalMax = Math.max(...allValues);
          const range = globalMax - globalMin;
          
          // Create consistent bins across all datasets
          const bins = Array.from({length: binCount}, (_, i) => 
              globalMin + (i * range / binCount));
          
          // Process each dataset
          rawData.datasets.forEach(dataset => {
              const histogram = new Array(binCount).fill(0);
              let totalCount = 0;
              
              // Count values in each bin
              dataset.data.forEach(value => {
                  const binIndex = Math.min(
                      binCount - 1,
                      Math.floor(((value - globalMin) / range) * binCount)
                  );
                  histogram[binIndex]++;
                  totalCount++;
              });
              
              // Convert to percentage of total if desired
              const normalized = histogram.map(count => totalCount > 0 ? count / totalCount : 0);
              
              processed.datasets.push({
                  label: dataset.label,
                  data: bins.map((bin, i) => ({
                      x: bin,
                      y: histogram[i],
                      count: histogram[i],
                      binStart: bin,
                      binEnd: bin + (range / binCount)
                  })),
                  total: totalCount
              });
          });

          // Generate readable bin labels
          processed.labels = bins.map((bin, i) => {
              const binWidth = range / binCount;
              return `${(bin * 100).toFixed(2)}% to ${((bin + binWidth) * 100).toFixed(2)}%`;
          });

          // Add metadata
          processed.metadata = {
              binCount,
              globalMin: globalMin * 100 + '%',
              globalMax: globalMax * 100 + '%',
              totalValues: allValues.length
          };

          return processed;

      } catch (error) {
          console.error('Error in preprocessLargeData:', error);
          return { labels: [], datasets: [], error: error.message };
      }
  }

  // // Helper function for large datasets
  // function preprocessLargeData(rawData) {
  //   const binCount = Math.min(50, Math.floor(rawData.labels.length / 20));
  //   const processed = { labels: [], datasets: [] };
    
  //   rawData.datasets.forEach(dataset => {
  //     const histogram = {};
  //     dataset.data.forEach((value, i) => {
  //       const bin = Math.floor(value * binCount) / binCount;
  //       histogram[bin] = (histogram[bin] || 0) + 1;
  //     });
      
  //     processed.datasets.push({
  //       label: dataset.label,
  //       data: Object.entries(histogram).map(([bin, count]) => ({
  //         x: parseFloat(bin),
  //         y: count,
  //         count: count
  //       }))
  //     });
  //   });
    
  //   // Generate clean bin labels
  //   const bins = [...new Set(processed.datasets.flatMap(d => d.data.map(i => i.x)))].sort();
  //   processed.labels = bins.map(b => `${(b * 100).toFixed(1)}% to ${((b + (1/binCount)) * 100).toFixed(1)}%`);
    
  //   return processed;
  // }
});
