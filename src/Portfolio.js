import React, { useState, useEffect } from 'react';

function Portfolio({ username, marketData }) {
  const [portfolioData, setPortfolioData] = useState([]);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:12345/getInventory?username=${username}`);
        const data = await response.json();
        setPortfolioData(data);
        console.log('持仓数据：', data);
      } catch (error) {
        console.error('获取持仓数据失败：', error);
      }
    };

    fetchPortfolioData();
  }, [username]);

  const calculateProfitLoss = (stock) => {
    const latestPrice = marketData.find((item) => item.code === stock.Code)?.price || 0;
    return (latestPrice - stock.AVG_Cost) * stock.Amount;
  };

  return (
    <div>
      <h2>持仓信息</h2>
      <table>
        <thead>
          <tr>
            <th>股票代码</th>
            <th>持仓数量</th>
            <th>总成本</th>
            <th>持仓平均成本</th>
            <th>最新价格</th>
            <th>盈亏金额</th>
          </tr>
        </thead>
        <tbody>
          {portfolioData.map((stock) => (
            <tr key={stock.Code}>
              <td>{stock.Code}</td>
              <td>{stock.Amount}</td>
              <td>{stock.Total_Cost}</td>
              <td>{stock.AVG_Cost}</td>
              <td>{marketData.find((item) => item.code === stock.Code)?.price || '加载中...'}</td>
              <td>{calculateProfitLoss(stock)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Portfolio;
