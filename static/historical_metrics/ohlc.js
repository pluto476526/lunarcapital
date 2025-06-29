// milky-way/static/historical_metrics/ohlc.js
//

// document.addEventListener('DOMContentLoaded', () => {
//   const container = document.getElementById('ohlcChart');
//   const chart = echarts.init(container, null, {
//     renderer: 'canvas',
//     useDirtyRect: false
//   });

//   function updateChart() {
//     if (!window.chart_ohlc) return;
    
//     const options = buildCandlestickOptions(
//       window.chart_ohlc.dates,
//       window.chart_ohlc.ohlc,
//       window.chart_ohlc.volume,
//       window.chart_ohlc.metadata.ticker
//     );
//     chart.setOption(options);
//   }

//   updateChart();
//   window.addEventListener('resize', () => chart.resize());

//   // Responsive to parent container size changes
//   new ResizeObserver(() => chart.resize()).observe(container);
// });

// function buildCandlestickOptions(dates, ohlcData, volumeData, ticker) {
//   return {
//     backgroundColor: 'transparent',
//     title: {
//       text: `${ticker} Candlestick Chart`,
//       left: 'center',
//       textStyle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#333'
//       }
//     },
//     tooltip: {
//       trigger: 'axis',
//       axisPointer: {
//         type: 'cross'
//       },
//       formatter: function(params) {
//         const date = params[0].axisValue;
//         const ohlc = params[0].data;
//         const vol = params[1] ? params[1].data[1] : 'N/A';
        
//         return `
//           <div style="font-weight:bold">${date}</div>
//           <div>Open: ${ohlc[0].toFixed(2)}</div>
//           <div>Close: ${ohlc[1].toFixed(2)}</div>
//           <div>Low: ${ohlc[2].toFixed(2)}</div>
//           <div>High: ${ohlc[3].toFixed(2)}</div>
//           <div>Volume: ${vol.toLocaleString()}</div>
//         `;
//       }
//     },
//     legend: {
//       data: ['Candlestick', 'Volume'],
//       top: 30,
//       textStyle: {
//         color: '#444'
//       }
//     },
//     grid: [
//       {
//         left: '3%',
//         right: '4%',
//         height: '60%',
//         top: '15%'
//       },
//       {
//         left: '3%',
//         right: '4%',
//         height: '20%',
//         top: '80%'
//       }
//     ],
//     xAxis: [
//       {
//         type: 'category',
//         data: dates,
//         scale: true,
//         boundaryGap: false,
//         axisLine: { onZero: false },
//         axisLabel: {
//           color: '#444',
//           fontSize: 12,
//           rotate: 30
//         },
//         splitLine: { show: false },
//         splitNumber: 20,
//         min: 'dataMin',
//         max: 'dataMax'
//       },
//       {
//         type: 'category',
//         gridIndex: 1,
//         data: dates,
//         scale: true,
//         boundaryGap: false,
//         axisLine: { onZero: false },
//         axisTick: { show: false },
//         axisLabel: { show: false },
//         splitLine: { show: false }
//       }
//     ],
//     yAxis: [
//       {
//         scale: true,
//         splitArea: {
//           show: true
//         },
//         axisLabel: {
//           color: '#444',
//           fontSize: 12,
//           formatter: '{value}'
//         },
//         axisLine: {
//           lineStyle: {
//             color: '#ccc'
//           }
//         }
//       },
//       {
//         scale: true,
//         gridIndex: 1,
//         splitNumber: 2,
//         axisLabel: { show: false },
//         axisLine: { show: false },
//         axisTick: { show: false },
//         splitLine: { show: false }
//       }
//     ],
//     series: [
//       {
//         name: 'Candlestick',
//         type: 'candlestick',
//         data: ohlcData,
//         itemStyle: {
//           color: '#ef232a',    // Down candle color
//           color0: '#14b143',   // Up candle color
//           borderColor: '#ef232a',
//           borderColor0: '#14b143'
//         },
//         emphasis: {
//           itemStyle: {
//             borderWidth: 2
//           }
//         }
//       },
//       {
//         name: 'Volume',
//         type: 'bar',
//         xAxisIndex: 1,
//         yAxisIndex: 1,
//         data: volumeData,
//         itemStyle: {
//           color: function(params) {
//             // Color volume bars based on price direction
//             const ohlc = ohlcData[params.dataIndex];
//             return ohlc[1] >= ohlc[0] ? '#14b143' : '#ef232a';
//           }
//         }
//       }
//     ],
//     dataZoom: [
//       {
//         type: 'inside',
//         xAxisIndex: [0, 1],
//         start: 0,
//         end: 100
//       },
//       {
//         show: true,
//         xAxisIndex: [0, 1],
//         type: 'slider',
//         top: '95%',
//         start: 0,
//         end: 100,
//         handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
//         handleSize: '80%',
//         handleStyle: {
//           color: '#fff',
//           shadowBlur: 3,
//           shadowColor: 'rgba(0, 0, 0, 0.6)',
//           shadowOffsetX: 2,
//           shadowOffsetY: 2
//         }
//       }
//     ]
//   };
// }



document.addEventListener('DOMContentLoaded', () => {
  const chart = echarts.init(document.getElementById('ohlcComparisonChart'), null, {
    renderer: 'canvas',
    useDirtyRect: false
  });

  function updateChart() {
    if (!window.chart_ohlc) return;
    
    const options = buildOhlcComparisonOptions(
      window.chart_ohlc.dates,
      window.chart_ohlc.series,
      window.chart_ohlc.metadata
    );
    chart.setOption(options);
  }

  updateChart();
  window.addEventListener('resize', () => chart.resize());
});

function buildOhlcComparisonOptions(dates, series, metadata) {
  return {
    backgroundColor: 'transparent',
    title: {
      text: 'OHLC Comparison',
      subtext: `Tickers: ${metadata.available_tickers.join(', ')}`,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function(params) {
        const date = params[0].axisValue;
        let html = `<div style="margin-bottom:5px;font-weight:bold">${date}</div>`;
        
        params.forEach(param => {
          const data = param.data;
          html += `
            <div style="display:flex;margin:3px 0">
              <div style="width:60px;color:${param.color}">${param.seriesName}</div>
              <div style="flex:1">
                O: ${data[0].toFixed(2)} | C: ${data[1].toFixed(2)}<br>
                L: ${data[2].toFixed(2)} | H: ${data[3].toFixed(2)}
              </div>
            </div>
          `;
        });
        
        return html;
      }
    },
    legend: {
      data: series.map(s => s.name),
      top: 40
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      top: 100
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        rotate: 30
      }
    },
    yAxis: {
      scale: true,
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: series.map(s => ({
      ...s,
      itemStyle: {
        color: '#ef232a',
        color0: '#14b143',
        borderColor: '#ef232a',
        borderColor0: '#14b143'
      }
    })),
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }
    ]
  };
}