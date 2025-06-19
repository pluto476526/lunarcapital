// milky-way/static/historical_data/rsi.js
// pkibuka@milky-way.space

document.addEventListener('DOMContentLoaded', () => {
  const chart = echarts.init(document.getElementById('rsiChart'), null, {
    renderer: 'canvas',
    useDirtyRect: false
  });

  function updateChart() {
    if (!window.chart_rsi) return;
    
    const options = buildRsiOptions(
      window.chart_rsi.dates,
      window.chart_rsi.series,
      window.chart_rsi.metadata.window
    );
    chart.setOption(options);
  }

  updateChart();
  window.addEventListener('resize', () => chart.resize());
});

function buildRsiOptions(dates, series, windowPeriod) {
  return {
    backgroundColor: 'transparent',
    title: {
      text: `RSI Comparison (${windowPeriod}-period)`,
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
      textStyle: { color: '#000' },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: series.map(s => s.name),
      top: 30,
      textStyle: {
        color: '#444'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      top: 80
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
      min: 0,
      max: 100,
      axisLabel: {
        color: '#444',
        fontSize: 12,
        formatter: '{value}'
      },
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      // Add RSI reference lines
      splitArea: {
        show: true,
        areaStyle: {
          color: [
            // Overbought area (70-100)
            {
              color: 'rgba(255, 0, 0, 0.1)'
            },
            // Neutral area (30-70)
            {
              color: 'rgba(0, 0, 0, 0)'
            },
            // Oversold area (0-30)
            {
              color: 'rgba(0, 128, 0, 0.1)'
            }
          ]
        }
      }
    },
    series: series.map(s => ({
      ...s,
      lineStyle: {
        width: 2
      },
      areaStyle: {
        opacity: 0.1
      },
      markLine: {
        silent: true,
        data: [
          {
            yAxis: 70,
            lineStyle: {
              color: '#f00',
              type: 'dashed'
            },
            label: {
              formatter: 'Overbought (70)',
              position: 'insideEndTop'
            }
          },
          {
            yAxis: 30,
            lineStyle: {
              color: '#080',
              type: 'dashed'
            },
            label: {
              formatter: 'Oversold (30)',
              position: 'insideEndBottom'
            }
          }
        ]
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