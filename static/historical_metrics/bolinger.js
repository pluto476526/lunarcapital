// milky-way/static/historical_data/bollinger.js
// pkibuka@milky-way.space


document.addEventListener('DOMContentLoaded', () => {
  const chart = echarts.init(document.getElementById('bollingerChart'), null, {
    renderer: 'canvas',
    useDirtyRect: false,
    backgroundColor: 'transparent'
  });

  function updateChart() {
    if (!window.chart_bb || !window.chart_bb.dates || !window.chart_bb.series) return;

    const { dates, series, metadata } = window.chart_bb;
    const options = buildBollingerOptions(dates, series, metadata.window, metadata.num_std);
    chart.setOption(options, { notMerge: true });
  }

  updateChart();
  window.addEventListener('resize', chart.resize);
});


function buildBollingerOptions(dates, series, windowPeriod, numStd) {
  const chartSeries = [];
  const legendData = [];
  const bandColors = {
    upper: '#FF6B6B',
    middle: '#4D96FF',
    lower: '#6BCB77',
    price: '#495057'
  };

  // Create a map for easier access to series data
  const seriesMap = new Map();
  Object.entries(series).forEach(([ticker, data]) => {
    seriesMap.set(ticker, data);
  });

  // Process each ticker
  seriesMap.forEach((data, ticker) => {
    const startIndex = data._startIdx || 0;
    
    // Custom series for band area
    chartSeries.push({
      name: `${ticker} Bands`,
      type: 'custom',
      renderItem: (params, api) => {
        const idx = params.dataIndex;
        if (idx < startIndex || idx >= dates.length - 1) return null;

        const upperCurrent = data.upper[idx];
        const upperNext = data.upper[idx + 1];
        const lowerCurrent = data.lower[idx];
        const lowerNext = data.lower[idx + 1];

        // Skip rendering if any value is invalid
        if ([upperCurrent, upperNext, lowerCurrent, lowerNext].some(v => 
          v === null || v === undefined || isNaN(v)
        )) return null;

        const upperCurrentCoord = api.coord([dates[idx], upperCurrent]);
        const upperNextCoord = api.coord([dates[idx + 1], upperNext]);
        const lowerCurrentCoord = api.coord([dates[idx], lowerCurrent]);
        const lowerNextCoord = api.coord([dates[idx + 1], lowerNext]);

        const bandWidth = api.size([1, 0])[0] * 0.8;

        return {
          type: 'polygon',
          shape: {
            points: [
              [upperCurrentCoord[0] - bandWidth / 2, upperCurrentCoord[1]],
              [upperNextCoord[0] - bandWidth / 2, upperNextCoord[1]],
              [lowerNextCoord[0] + bandWidth / 2, lowerNextCoord[1]],
              [lowerCurrentCoord[0] + bandWidth / 2, lowerCurrentCoord[1]]
            ]
          },
          style: {
            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 107, 107, 0.15)' },
              { offset: 1, color: 'rgba(107, 203, 119, 0.15)' }
            ])
          },
          silent: true,
          z: 0
        };
      },
      data: dates.map((date, idx) => {
        return idx >= startIndex && idx < data.upper.length + startIndex ? 
          [date, data.upper[idx], data.lower[idx], data.middle[idx], data.price[idx]] : 
          null;
      }).filter(item => item !== null)
    });

    // Line series for each band type
    ['upper', 'middle', 'lower', 'price'].forEach(band => {
      const isPrice = band === 'price';
      chartSeries.push({
        name: `${ticker} ${band.charAt(0).toUpperCase() + band.slice(1)}`,
        type: 'line',
        data: data[band],
        symbol: 'none',
        lineStyle: {
          width: isPrice ? 2.5 : band === 'middle' ? 1.5 : 1,
          color: bandColors[band],
          opacity: 0.9
        },
        z: isPrice ? 3 : 2,
        connectNulls: false,
        showSymbol: false
      });

      if (!isPrice) {
        legendData.push(`${ticker} ${band.charAt(0).toUpperCase() + band.slice(1)}`);
      }
    });
    legendData.push(`${ticker} Price`);
  });

  // Rest of the options configuration remains the same
  return {
    backgroundColor: 'transparent',
    title: {
      text: `Bollinger Bands (${windowPeriod}-period, ±${numStd}σ)`,
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
      axisPointer: { type: 'cross' },
      formatter: params => {
        const date = params[0].axisValue;
        let tooltip = `<div style="font-weight:bold;margin-bottom:8px">${date}</div>`;
        const tickerData = {};

        params.forEach(param => {
          const [ticker, band] = param.seriesName.split(' ');
          const bandType = band.toLowerCase();
          if (!tickerData[ticker]) tickerData[ticker] = {};
          if (typeof param.value === 'number') {
            tickerData[ticker][bandType] = param.value;
          }
        });

        Object.entries(tickerData).forEach(([ticker, bands]) => {
          if (bands.price === undefined) return;

          tooltip += `
            <div style="margin:8px 0">
              <div style="font-weight:bold;margin-bottom:4px">${ticker}</div>
              <div style="display:flex;justify-content:space-between">
                <span>Price:</span><span style="font-weight:bold">${bands.price.toFixed(2)}</span>
              </div>`;

          if (bands.upper !== undefined && bands.lower !== undefined) {
            const width = (bands.upper - bands.lower).toFixed(2);
            const position = ((bands.price - bands.lower) / (bands.upper - bands.lower) * 100).toFixed(1);
            tooltip += `
              <div style="display:flex;justify-content:space-between">
                <span>Band Position:</span><span>${position}%</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span>Band Width:</span><span>${width}</span>
              </div>`;
          }
          tooltip += `</div>`;
        });

        return tooltip;
      }
    },
    legend: {
      data: legendData,
      top: 40,
      textStyle: { color: '#343A40', fontWeight: '500' },
      itemGap: 20
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '14%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLabel: {
        color: '#444',
        fontSize: 12,
        rotate: 30
      },
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      }
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: { color: '#7A7A7A' },
      axisLine: { lineStyle: { color: '#CED4DA' } },
      splitLine: { lineStyle: { color: '#E9ECEF' } }
    },
    series: chartSeries,
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
