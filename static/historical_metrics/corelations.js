// milky-way/static/historical_data/corelations.js
// pkibuka@milky-way.space


document.addEventListener('DOMContentLoaded', () => {
  const chart = echarts.init(document.getElementById('correlationHeatmap'), null, {
    renderer: 'canvas',
    useDirtyRect: false
  });

  function updateChart() {
    const matrix = window.chart_corr.correlation_matrix;
    const tickers = window.chart_corr.tickers;
    const options = buildHeatmapOptions(matrix, tickers);
    chart.setOption(options);
  }

  updateChart();

  window.addEventListener('resize', () => chart.resize());

});

function buildHeatmapOptions(matrix, tickers) {
  const dataPoints = [];
  for (let i = 0; i < tickers.length; i++) {
    for (let j = 0; j < tickers.length; j++) {
      dataPoints.push([i, j, matrix[i][j]]);
    }
  }

  return {
    backgroundColor: 'transparent',
    title: {
      text: 'Stock Correlation Heatmap',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      position: 'top',
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
      textStyle: { color: '#000' },
      formatter: params => {
        const value = params.value[2].toFixed(2);
        const xTicker = tickers[params.value[0]];
        const yTicker = tickers[params.value[1]];
        return `${xTicker} vs ${yTicker}<br>Correlation: <b>${value}</b>`;
      }
    },
    grid: {
      top: 80,
      left: 100,
      right: 100,
      bottom: 100,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: tickers,
      axisLabel: { rotate: -45, color: '#444', fontSize: 12 },
      axisLine: { lineStyle: { color: '#ccc' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'category',
      data: tickers,
      inverse: true,
      axisLabel: { color: '#444', fontSize: 12 },
      axisLine: { lineStyle: { color: '#ccc' } },
      axisTick: { show: false }
    },
    visualMap: {
      min: -1,
      max: 1,
      inRange: {
        color: [
          '#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8',
          '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'
        ]
      },
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 30
    },
    series: [{
      type: 'heatmap',
      data: dataPoints,
      label: {
        show: true,
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
        formatter: params => params.value[2].toFixed(2)
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1,
        emphasis: {
          borderColor: '#000',
          borderWidth: 2
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
}
