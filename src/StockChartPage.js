import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Chart, TimeScale, LinearScale } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

Chart.register(TimeScale, LinearScale);
console.log(Chart.controllers); // 检查注册的控制器列表


function StockChartPage() {
  const { stockCode, stockName } = useParams();
  const [stockData, setStockData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    let currentChartInstance = chartRef.current;

    if (currentChartInstance) {
      currentChartInstance.destroy();
    }

    const fetchStockData = async () => {
      try {
        if (!stockCode) {
          console.log('Invalid stock code:', stockCode);
          return;
        }
        const response = await fetch(`http://127.0.0.1:12345/getStockPrice?code=${stockCode}`);
        const data = await response.json();
        if (data && data.length > 0) {
          const currentTimeInSeconds = Math.floor(Date.now() / 1000);
          const newData = data.map((price, index) => ({
            time: currentTimeInSeconds - (data.length - index - 1) * 5 * 1000,
            price: price
          }));
          setStockData(prevData => {
            const updatedData = [...prevData, ...newData].slice(-10); // 仅保留最近的十个数据点
            return updatedData;
          });
        } else {
          console.error('获取的股票数据为空。');
        }
      } catch (error) {
        console.error('获取股票数据失败：', error);
      }
    };

    const stockDataTimer = setInterval(() => {
      fetchStockData();
    }, 5000);

    fetchStockData();

    return () => {
      clearInterval(stockDataTimer);
    };
  }, [stockCode]);

  useEffect(() => {
    const ctx = document.getElementById('stock-chart');
    // 检查是否已经存在图表实例，如果存在则销毁
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const newChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        // 将时间转换为 Date 对象
        labels: stockData.map(dataPoint => new Date(dataPoint.time)),
        datasets: [{
          label: '股票价格',
          data: stockData.map(dataPoint => dataPoint.price),
          borderColor: 'blue',
          fill: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time', // 修改为时间类型
            time: {
              unit: 'second' // 可以根据需要设置时间单位
            },
            display: true,
            title: {
              display: true,
              text: '时间',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: '价格',
            },
          },
        },
      },
    });

    chartRef.current = newChartInstance;

    return () => {
      // 在组件卸载时销毁图表实例
      newChartInstance.destroy();
    };
  }, [stockData]);

  return (
    <div>
      <h1>股票行情图表</h1>
      <h2>股票名称: {stockName}</h2>
      <div>
        <canvas id="stock-chart" />
      </div>
    </div>
  );
}

export default StockChartPage;
