import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
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

export default Home;
