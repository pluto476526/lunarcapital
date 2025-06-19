// milky-way/static/historical_data/bollinger.js
// pkibuka@milky-way.space



// document.addEventListener('DOMContentLoaded', () => {
//   const chart = echarts.init(document.getElementById('bollingerChart'), null, {
//     renderer: 'canvas',
//     useDirtyRect: false,
//     // Transparent background for embedding in different themes
//     backgroundColor: 'transparent'
//   });

//   function updateChart() {
//     const options = buildBollingerOptions(
//       window.chart_bb.dates,
//       window.chart_bb.series,
//       window.chart_bb.metadata.window,
//       window.chart_bb.metadata.num_std
//     );
//     chart.setOption(options);
//   }

//   updateChart();
//   window.addEventListener('resize', chart.resize);
// });

// function buildBollingerOptions(dates, series, windowPeriod, numStd) {
//   const chartSeries = [];
//   const legendData = [];
//   const bandColors = {
//     upper: '#FF4D4F',   // professional red
//     middle: '#1890FF',  // polished blue
//     lower: '#52C41A',   // fresh green
//     price: '#343A40'    // dark gray for price line
//   };

//   Object.entries(series).forEach(([ticker, data]) => {
//     // Prepare data for custom band shading series
//     // Format: [date, upper, lower, middle, price]
//     const bandData = dates.map((date, i) => [
//       date,
//       data.upper[i],
//       data.lower[i],
//       data.middle[i],
//       data.price[i]
//     ]);

//     // Custom series for shaded Bollinger band area
//     chartSeries.push({
//       name: `${ticker} Bands`,
//       type: 'custom',
//       data: bandData,
//       renderItem: (params, api) => {
//         const dataIndex = params.dataIndex;

//         // Ensure we do not exceed bounds
//         if (dataIndex >= dates.length - 1) return;

        
//         const dateCurrent = dates[dataIndex];
//         const dateNext = dates[dataIndex + 1];
        
//         // Get values directly from the current data item
//         const upperCurrent = api.value(1);
//         const upperNext = api.value(1, dataIndex + 1);
//         const lowerCurrent = api.value(2);
//         const lowerNext = api.value(2, dataIndex + 1);

//         const upperCurrentCoord = api.coord([dateCurrent, upperCurrent]);
//         const upperNextCoord = api.coord([dateNext, upperNext]);
//         const lowerCurrentCoord = api.coord([dateCurrent, lowerCurrent]);
//         const lowerNextCoord = api.coord([dateNext, lowerNext]);

//         const bandWidth = api.size([1, 0])[0] * 0.8;

//         const points = [
//           [upperCurrentCoord[0] - bandWidth / 2, upperCurrentCoord[1]],
//           [upperNextCoord[0] - bandWidth / 2, upperNextCoord[1]],
//           [lowerNextCoord[0] + bandWidth / 2, lowerNextCoord[1]],
//           [lowerCurrentCoord[0] + bandWidth / 2, lowerCurrentCoord[1]]
//         ];
//         return {
//           type: 'polygon',
//           shape: { points },
//           style: {
//             fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//               { offset: 0, color: 'rgba(255, 77, 79, 0.15)' },
//               { offset: 1, color: 'rgba(82, 196, 26, 0.15)' }
//             ]),
//             stroke: 'transparent'
//           },
//           silent: true,
//           z: 0
//         };
//       }
//     });

//     // Add Bollinger band lines and price line
//     ['upper', 'middle', 'lower', 'price'].forEach((band, i) => {
//       chartSeries.push({
//         name: `${ticker} ${band.charAt(0).toUpperCase() + band.slice(1)}`,
//         type: 'line',
//         data: data[band],
//         symbol: 'none',
//         lineStyle: {
//           width: i === 3 ? 2.5 : (i === 1 ? 1.5 : 1),
//           color: bandColors[band],
//           opacity: 0.85
//         },
//         smooth: true,
//         z: i === 3 ? 3 : 2
//       });

//       if (i !== 3) {
//         legendData.push(`${ticker} ${band.charAt(0).toUpperCase() + band.slice(1)}`);
//       }
//     });

//     legendData.push(`${ticker} Price`);
//   });

//   return {
//     backgroundColor: 'transparent',
//     title: {
//       text: `Bollinger Bands (${windowPeriod}-period, ${numStd}σ)`,
//       left: 'center',
//       textStyle: {
//         fontSize: 20,
//         fontWeight: '600',
//         color: '#343A40'
//       }
//     },
//     tooltip: {
//       trigger: 'axis',
//       backgroundColor: 'rgba(255,255,255,0.95)',
//       borderColor: '#D9D9D9',
//       borderWidth: 1,
//       textStyle: { color: '#343A40', fontWeight: '500' },
//       axisPointer: {
//         type: 'cross',
//         label: { backgroundColor: '#999' }
//       },
//       formatter: (params) => {
//         let html = `<div style="font-weight:bold;margin-bottom:8px">${params[0].axisValue}</div>`;
//         const tickers = {};

//         // First pass: collect all data points
//         params.forEach(param => {
//           const parts = param.seriesName.split(' ');
//           const ticker = parts[0];
//           const band = parts.slice(1).join(' ').toLowerCase();
          
//           if (!tickers[ticker]) {
//             tickers[ticker] = {};
//           }
          
//           // Only store if this is a numeric value (not the band area series)
//           if (typeof param.value === 'number') {
//             tickers[ticker][band] = param.value;
//           }
//         });

//         // Second pass: generate tooltip content
//         Object.entries(tickers).forEach(([ticker, bands]) => {
//           // Skip if we don't have price data (this would be the band area series)
//           if (typeof bands.price === 'undefined') return;

//           html += `
//             <div style="margin:8px 0; font-size: 13px;">
//               <div style="font-weight:bold; color:#343A40; margin-bottom:4px;">${ticker}</div>
//               <div style="display:flex; justify-content:space-between;">
//                 <span>Price:</span>
//                 <span style="font-weight:bold">${bands.price.toFixed(2)}</span>
//               </div>`;
          
//           // Only show band info if we have upper and lower bands
//           if (typeof bands.upper !== 'undefined' && typeof bands.lower !== 'undefined') {
//             const width = (bands.upper - bands.lower).toFixed(2);
//             const pctFromLower = ((bands.price - bands.lower) / (bands.upper - bands.lower) * 100).toFixed(1);
            
//             html += `
//               <div style="display:flex; justify-content:space-between;">
//                 <span>Band Position:</span>
//                 <span>${pctFromLower}%</span>
//               </div>
//               <div style="display:flex; justify-content:space-between;">
//                 <span>Band Width:</span>
//                 <span>${width}</span>
//               </div>`;
//           }
          
//           html += `</div>`;
//         });

//         return html;
//       }
//     },
//     legend: {
//       data: legendData,
//       top: 40,
//       textStyle: { color: '#343A40', fontWeight: '500' },
//       inactiveColor: '#B0B0B0',
//       itemGap: 20,
//       selectedMode: 'multiple'
//     },
//     grid: {
//       left: '4%',
//       right: '4%',
//       bottom: '14%',
//       top: '30%',
//       containLabel: true
//     },
//     xAxis: {
//       type: 'category',
//       boundaryGap: false,
//       data: dates,
//       axisLabel: {
//         color: '#7A7A7A',
//         rotate: 30,
//         fontWeight: '500',
//         formatter: value => {
//           const date = new Date(value);
//           return `${date.getMonth() + 1}/${date.getDate()}`;
//         }
//       },
//       axisLine: { lineStyle: { color: '#CED4DA' } },
//       axisTick: { alignWithLabel: true }
//     },
//     yAxis: {
//       type: 'value',
//       scale: true,
//       axisLabel: { color: '#7A7A7A', fontWeight: '500' },
//       axisLine: { lineStyle: { color: '#CED4DA' } },
//       splitLine: { lineStyle: { color: '#E9ECEF' } }
//     },
//     series: chartSeries,
//     dataZoom: [
//       {
//         type: 'inside',
//         start: 0,
//         end: 100,
//         zoomLock: true
//       },
//       {
//         type: 'slider',
//         bottom: '6%',
//         backgroundColor: 'rgba(255, 255, 255, 0.8)',
//         borderColor: '#CED4DA',
//         handleSize: '80%',
//         handleStyle: {
//           color: '#495057',
//           shadowBlur: 3,
//           shadowColor: 'rgba(0, 0, 0, 0.15)'
//         }
//       }
//     ]
//   };
// }



// milky-way/static/historical_data/bollinger.js
// pkibuka@milky-way.space

document.addEventListener('DOMContentLoaded', () => {
  const chart = echarts.init(document.getElementById('bollingerChart'), null, {
    renderer: 'canvas',
    useDirtyRect: false,
    // Transparent background for embedding in different themes
    backgroundColor: 'transparent'
  });

  function updateChart() {
    const options = buildBollingerOptions(
      window.chart_bb.dates,
      window.chart_bb.series,
      window.chart_bb.metadata.window,
      window.chart_bb.metadata.num_std
    );
    chart.setOption(options);
  }

  updateChart();
  window.addEventListener('resize', chart.resize);
});

function buildBollingerOptions(dates, series, windowPeriod, numStd) {
  const chartSeries = [];
  const legendData = [];
  const bandColors = {
    upper: '#FF6B6B',   // brighter vibrant red
    middle: '#4D96FF',  // brighter vibrant blue
    lower: '#6BCB77',   // brighter vibrant green
    price: '#495057'    // slightly brighter dark gray for price line
  };

  Object.entries(series).forEach(([ticker, data]) => {
    // Prepare data for custom band shading series
    // Format: [date, upper, lower, middle, price]
    const bandData = dates.map((date, i) => [
      date,
      data.upper[i],
      data.lower[i],
      data.middle[i],
      data.price[i]
    ]);

    // Custom series for shaded Bollinger band area
    chartSeries.push({
      name: `${ticker} Bands`,
      type: 'custom',
      data: bandData,
      renderItem: (params, api) => {
        const dataIndex = params.dataIndex;

        // Ensure we do not exceed bounds
        if (dataIndex >= dates.length - 1) return;

        
        const dateCurrent = dates[dataIndex];
        const dateNext = dates[dataIndex + 1];
        
        // Get values directly from the current data item
        const upperCurrent = api.value(1);
        const upperNext = api.value(1, dataIndex + 1);
        const lowerCurrent = api.value(2);
        const lowerNext = api.value(2, dataIndex + 1);

        const upperCurrentCoord = api.coord([dateCurrent, upperCurrent]);
        const upperNextCoord = api.coord([dateNext, upperNext]);
        const lowerCurrentCoord = api.coord([dateCurrent, lowerCurrent]);
        const lowerNextCoord = api.coord([dateNext, lowerNext]);

        const bandWidth = api.size([1, 0])[0] * 0.8;

        const points = [
          [upperCurrentCoord[0] - bandWidth / 2, upperCurrentCoord[1]],
          [upperNextCoord[0] - bandWidth / 2, upperNextCoord[1]],
          [lowerNextCoord[0] + bandWidth / 2, lowerNextCoord[1]],
          [lowerCurrentCoord[0] + bandWidth / 2, lowerCurrentCoord[1]]
        ];
        return {
          type: 'polygon',
          shape: { points },
          style: {
            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 107, 107, 0.2)' },  // brighter red
              { offset: 1, color: 'rgba(107, 203, 119, 0.2)' }    // brighter green
            ]),
            stroke: 'transparent'
          },
          silent: true,
          z: 0
        };
      }
    });

    // Add Bollinger band lines and price line
    ['upper', 'middle', 'lower', 'price'].forEach((band, i) => {
      chartSeries.push({
        name: `${ticker} ${band.charAt(0).toUpperCase() + band.slice(1)}`,
        type: 'line',
        data: data[band],
        symbol: 'none',
        lineStyle: {
          width: i === 3 ? 2.5 : (i === 1 ? 1.5 : 1),
          color: bandColors[band],
          opacity: 0.9  // slightly more opaque for better visibility
        },
        smooth: true,
        z: i === 3 ? 3 : 2
      });

      if (i !== 3) {
        legendData.push(`${ticker} ${band.charAt(0).toUpperCase() + band.slice(1)}`);
      }
    });

    legendData.push(`${ticker} Price`);
  });

  return {
    backgroundColor: 'transparent',
    title: {
      text: `Bollinger Bands (${windowPeriod}-period, ${numStd}σ)`,
      left: 'center',
      textStyle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#343A40'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#D9D9D9',
      borderWidth: 1,
      textStyle: { color: '#343A40', fontWeight: '500' },
      axisPointer: {
        type: 'cross',
        label: { backgroundColor: '#999' }
      },
      formatter: (params) => {
        let html = `<div style="font-weight:bold;margin-bottom:8px">${params[0].axisValue}</div>`;
        const tickers = {};

        // First pass: collect all data points
        params.forEach(param => {
          const parts = param.seriesName.split(' ');
          const ticker = parts[0];
          const band = parts.slice(1).join(' ').toLowerCase();
          
          if (!tickers[ticker]) {
            tickers[ticker] = {};
          }
          
          // Only store if this is a numeric value (not the band area series)
          if (typeof param.value === 'number') {
            tickers[ticker][band] = param.value;
          }
        });

        // Second pass: generate tooltip content
        Object.entries(tickers).forEach(([ticker, bands]) => {
          // Skip if we don't have price data (this would be the band area series)
          if (typeof bands.price === 'undefined') return;

          html += `
            <div style="margin:8px 0; font-size: 13px;">
              <div style="font-weight:bold; color:#343A40; margin-bottom:4px;">${ticker}</div>
              <div style="display:flex; justify-content:space-between;">
                <span>Price:</span>
                <span style="font-weight:bold">${bands.price.toFixed(2)}</span>
              </div>`;
          
          // Only show band info if we have upper and lower bands
          if (typeof bands.upper !== 'undefined' && typeof bands.lower !== 'undefined') {
            const width = (bands.upper - bands.lower).toFixed(2);
            const pctFromLower = ((bands.price - bands.lower) / (bands.upper - bands.lower) * 100).toFixed(1);
            
            html += `
              <div style="display:flex; justify-content:space-between;">
                <span>Band Position:</span>
                <span>${pctFromLower}%</span>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span>Band Width:</span>
                <span>${width}</span>
              </div>`;
          }
          
          html += `</div>`;
        });

        return html;
      }
    },
    legend: {
      data: legendData,
      top: 40,
      textStyle: { color: '#343A40', fontWeight: '500' },
      inactiveColor: '#B0B0B0',
      itemGap: 20,
      selectedMode: 'multiple'
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '14%',
      top: '30%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLabel: {
        color: '#7A7A7A',
        rotate: 30,
        fontWeight: '500',
        formatter: value => {
          const date = new Date(value);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        }
      },
      axisLine: { lineStyle: { color: '#CED4DA' } },
      axisTick: { alignWithLabel: true }
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: { color: '#7A7A7A', fontWeight: '500' },
      axisLine: { lineStyle: { color: '#CED4DA' } },
      splitLine: { lineStyle: { color: '#E9ECEF' } }
    },
    series: chartSeries,
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
        zoomLock: true
      },
      {
        type: 'slider',
        bottom: '6%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: '#CED4DA',
        handleSize: '80%',
        handleStyle: {
          color: '#495057',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.15)'
        }
      }
    ]
  };
}