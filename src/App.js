import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function StockChartPage({ stockCode }) {
  const [stockData, setStockData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchStockData = async () => {
      const response = await fetch(`http://127.0.0.1:12345/getStockData?code=${stockCode}`);
      const data = await response.json();
      setStockData(data);
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

  const renderChart = () => {
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
    const ctx = document.getElementById('stockChart');
    if (ctx) {
      chartRef.current = new Chart(ctx.current, {
        type: 'line',
        data: chartData,
        options: chartOptions,
      });
    }
  };

  useEffect(() => {
    renderChart();
  }, [stockData]);

  return (
    <div>
      <h1>股票行情图表</h1>
      <Link to="/">返回</Link>
      <canvas id="stockChart"></canvas>
    </div>
  );
}

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [marketData, setMarketData] = useState([]);
  const [shanghaiStocks, setShanghaiStocks] = useState([]);
  const [shenzhenStocks, setShenzhenStocks] = useState([]);
  const [gemStocks, setGemStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:12345/getMarketPrice');
      const data = await response.json();

      const shanghaiStocks = data.filter(stock => stock.Code.startsWith('6'));
      const shenzhenStocks = data.filter(stock => stock.Code.startsWith('0'));
      const gemStocks = data.filter(stock => stock.Code.startsWith('3'));

      setMarketData(data);
      setShanghaiStocks(shanghaiStocks);
      setShenzhenStocks(shenzhenStocks);
      setGemStocks(gemStocks);
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
    //<Router>标签报错JSX expressions must have one parent element.
    //<Router>标签只有一个父元素包裹。可以使用一个<div>元素或React的Fragment (<>...</>) 来包裹<Router>标签和其子元素。
    <>
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
            {/* 其他功能组件 */}
            <h2>大盘行情</h2>
            <select value={selectedStock} onChange={e => setSelectedStock(e.target.value)}>
              <option value="">全部</option>
              <option value="shanghai">沪市</option>
              <option value="shenzhen">深市</option>
              <option value="gem">创业板</option>
            </select>
            <table>
              <thead>
                <tr>
                  <th>代码</th>
                  <th>名称</th>
                  <th>最新价格</th>
                  <th>当日涨跌幅</th>
                  <th>当日涨跌价</th>
                </tr>
              </thead>
              <tbody>
                {selectedStock === '' ? (
                  marketData.map(stock => (
                    <tr key={stock.Code}>
                      <td>{stock.Code}</td>
                      <td>{stock.Name}</td>
                      <td>{stock.Price}</td>
                      <td>{stock.ChangePercent}</td>
                      <td>{stock.ChangeAmount}</td>
                      <td>
                        <Link to={`/stock/${stock.Code}`}>查看曲线</Link>
                      </td>
                    </tr>
                  ))
                ) : selectedStock === 'shanghai' ? (
                  shanghaiStocks.map(stock => (
                    <tr key={stock.Code}>
                      <td>{stock.Code}</td>
                      <td>{stock.Name}</td>
                      <td>{stock.Price}</td>
                      <td>{stock.ChangePercent}</td>
                      <td>{stock.ChangeAmount}</td>
                      <td>
                        <Link to={`/stock/${stock.Code}`}>查看曲线</Link>
                      </td>
                    </tr>
                  ))
                ) : selectedStock === 'shenzhen' ? (
                  shenzhenStocks.map(stock => (
                    <tr key={stock.Code}>
                      <td>{stock.Code}</td>
                      <td>{stock.Name}</td>
                      <td>{stock.Price}</td>
                      <td>{stock.ChangePercent}</td>
                      <td>{stock.ChangeAmount}</td>
                      <td>
                        <Link to={`/stock/${stock.Code}`}>查看曲线</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  gemStocks.map(stock => (
                    <tr key={stock.Code}>
                      <td>{stock.Code}</td>
                      <td>{stock.Name}</td>
                      <td>{stock.Price}</td>
                      <td>{stock.ChangePercent}</td>
                      <td>{stock.ChangeAmount}</td>
                      <td>
                        <Link to={`/stock/${stock.Code}`}>查看曲线</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Routes>
        <Route path="/stock/:stockCode" element={<StockChartPage />} />
      </Routes>
    </Router>
  </>
  );
}

export default App;