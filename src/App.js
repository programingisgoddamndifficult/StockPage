import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import StockChartPage from './StockChartPage';

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
      } catch (error) {
        console.error('获取股票数据失败：', error);
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

export default App;
