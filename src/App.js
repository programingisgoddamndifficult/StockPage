import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {Chart,Title, Tooltip, Legend } from 'chart.js';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function StockChartPage({ stockCode, stockName }) {
  const [stockData, setStockData] = useState([]);
  const chartRef = useRef(null);
  
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:12345/getStockData?code=${stockCode}`);
        const data = await response.json();
        setStockData(data);
      } catch (error) {
        console.error('Failed to fetch stock data:', error);
      }
    };

    const stockDataTimer = setInterval(() => {
      fetchStockData();
    }, 5000);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      clearInterval(stockDataTimer);
    };
  }, [stockCode]);

  const renderChart=()=> {
    const chartData = {
      labels: stockData.map(dataPoint => dataPoint.label),
      datasets: [
        {
          label: '股票价格',
          data: stockData.map(dataPoint => dataPoint.price),
          borderColor: 'blue',
          fill: false,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxis: {
          display: true,
          title: {
            display: true,
            text: '时间',
          },
        },
        yAxis: {
          display: true,
          title: {
            display: true,
            text: '价格',
          },
        },
      },
    };

    // 创建和渲染图表
    const ctx = chartRef.current;
    if (ctx) {
      chartRef.current = new Chart(chartRef.current, {
        type: 'line',
        data: chartData,
        options: chartOptions,
      });
    }
    return (
      <Line data={chartData} options={chartOptions} ref={chartRef} />
    );
  };

  useEffect(() => {
    renderChart()
  }, [stockData]);

  return (
    <div>
      <h1>股票行情图表</h1>
      <h2>股票名称: {stockName}</h2>
      <div>
        {stockData.length > 0 ? (
          renderChart()
        ) : (
          <p>Loading stock data...</p>
        )}
      </div>
      <Link to="/">返回</Link>
    </div>
  );
}

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:12345/getMarketPrice');
      const data = await response.json();

      setMarketData(data);
    };

    const timer = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleRegister = async () => {
    const response = await fetch(`http://127.0.0.1:12345/regist?username=${username}&pwd=${password}`);
    const data = await response.json();

    if (data === true) {
      console.log('注册成功');
    } else {
      console.log('注册失败');
    }
  };

  const handleLogin = async () => {
    const response = await fetch(`http://127.0.0.1:12345/login?username=${username}&pwd=${password}`);
    const data = await response.json();

    if (data === true) {
      setLoggedIn(true);
      console.log('登录成功');
    } else {
      console.log('登录失败');
    }
  };

  return (
    <Router>
      <div>
        {loggedIn ? (
          <div>
            <h1>登录用户界面</h1>
            {/* 其他功能组件 */}
          </div>
        ) : (
          <div>
            <h1>游客界面</h1>
            <input type="text" placeholder="用户名" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleRegister}>注册</button>
            <button onClick={handleLogin}>登录</button>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home marketData={marketData} />} />
          <Route path="/chart/:stockCode/:stockName" element={<StockChartPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home({ marketData }) {
  return (
    <div>
      <h1>股票市场行情</h1>
      <table>
        <thead>
          <tr>
            <th>股票代码</th>
            <th>股票名称</th>
            <th>股票价格</th>
          </tr>
        </thead>
        <tbody>
          {marketData.map(stock => (
            <tr key={stock.Code}>
              <td>{stock.Code}</td>
              <td>
                <Link to={`/chart/${stock.Code}/${stock.Name}`}>{stock.Name}</Link>
              </td>
              <td>{stock.Price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;