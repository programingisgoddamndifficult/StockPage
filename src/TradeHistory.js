import React, { useState, useEffect } from 'react';
import './App.css'; 

function TradeHistory({ username }) {
  const [tradeRecords, setTradeRecords] = useState([]);

  useEffect(() => {
    const fetchTradeRecords = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:12345/getTradeRecord?username=${username}`);
        const data = await response.json();
        setTradeRecords(data);
        console.log('交易记录：', data);
      } catch (error) {
        console.error('获取交易记录失败：', error);
      }
    };

    fetchTradeRecords();
  }, [username]);

  const renderTradeRecordsTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>交易时间</th>
            <th>股票代码</th>
            <th>交易方向</th>
            <th>交易金额</th>
            <th>交易数量</th>
          </tr>
        </thead>
        <tbody>
          {tradeRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.TradeTime}</td>
              <td>{record.Code}</td> 
              <td>{record.Direction === 0 ? '买入' : '卖出'}</td>
              <td>{record.KnockPrice * record.Amount}</td>
              <td>{record.Amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>交易记录</h2>
      {renderTradeRecordsTable()}
    </div>
  );
}

export default TradeHistory;
