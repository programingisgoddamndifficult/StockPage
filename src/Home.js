import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [marketData, setMarketData] = useState([]);
  const [filter, setFilter] = useState('all'); // 添加一个状态来表示过滤条件，默认为'all'
  // const [initialMarketData, setInitialMarketData] = useState([]);

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

  // 根据过滤条件筛选股票数据
  const filteredMarketData = marketData.filter(stock => {
    if (filter === 'all') {
      return true; // 不进行过滤
    } else if (filter === 'sh') {
      return stock.Code.startsWith('6'); // 沪市股票代码以6开头
    } else if (filter === 'sz') {
      return stock.Code.startsWith('3'); // 深市股票代码以3开头
    } else if (filter === 'cyb') {
      return stock.Code.startsWith('0'); // 创业板股票代码以0开头
    }
  });

  const calculateChange = (initialPrice, currentPrice) => {
    const change = currentPrice - initialPrice;
    const changePercentage = ((currentPrice - initialPrice) / initialPrice) * 100;
    return { change, changePercentage };
  };


  return (
    <div>
      <h1>股票市场行情</h1>
      <div>
        <button onClick={() => setFilter('all')}>全部</button>
        <button onClick={() => setFilter('sh')}>沪市</button>
        <button onClick={() => setFilter('sz')}>深市</button>
        <button onClick={() => setFilter('cyb')}>创业板</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>股票代码</th>
            <th>股票名称</th>
            <th>股票价格</th>
            <th>当日涨跌幅</th>
            <th>当日涨跌价</th>
          </tr>
        </thead>
        <tbody>
          {filteredMarketData.map(stock => (
            <tr key={stock.Code}>
              <td>{stock.Code}</td>
              <td>
                <Link to={`/chart/${stock.Code}/${stock.Name}`}>{stock.Name}</Link>
              </td>
              <td>{stock.Price}</td>
              {/* <td>{calculateChange(initialMarketData.find(data => data.Code === stock.Code).Price, stock.Price).changePercentage.toFixed(2)}%</td>
              <td>{calculateChange(initialMarketData.find(data => data.Code === stock.Code).Price, stock.Price).change.toFixed(2)}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
