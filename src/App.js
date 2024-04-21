import React, { useState, useEffect, useRef } from 'react';
// import { Line } from 'react-chartjs-2';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {Chart, TimeScale,LinearScale} from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(TimeScale,LinearScale); 

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
            time: currentTimeInSeconds - (data.length - index - 1) * 5 *1000,
            price: price
          }));
          setStockData(prevData => [...prevData, ...newData]);
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
      try {
        const response = await fetch('http://127.0.0.1:12345/getMarketPrice');
        const data = await response.json();
        setMarketData(data);
        // console.log('Stock Data:', data);
      }     
      catch (error) {
        console.error('获取股票数据失败：', error);//网页端f12查看控制台
      }
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