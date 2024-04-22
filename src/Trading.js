import React, { useState } from 'react';

function Trading() {
  const [username, setUsername] = useState('');
  const [stockCode, setStockCode] = useState('');
  const [direction, setDirection] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [tradeStatus, setTradeStatus] = useState('');

  const handleTrade = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:12345/trade?username=${username}&code=${stockCode}&direction=${direction}&price=${price}&amount=${amount}`);
      const data = await response.json();
      setTradeStatus(data);
    } catch (error) {
      console.error('交易失败：', error);
      setTradeStatus('交易失败');
    }
  };

  return (
    <div>
      <h2>股票交易</h2>
      <div>
        <label>用户名:</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      <div>
        <label>股票代码:</label>
        <input type="text" value={stockCode} onChange={e => setStockCode(e.target.value)} />
      </div>
      <div>
        <label>交易方向:</label>
        <select value={direction} onChange={e => setDirection(e.target.value)}>
          <option value="buy">买入</option>
          <option value="sell">卖出</option>
        </select>
      </div>
      <div>
        <label>挂单价格:</label>
        <input type="text" value={price} onChange={e => setPrice(e.target.value)} />
      </div>
      <div>
        <label>挂单数量:</label>
        <input type="text" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>
      <button onClick={handleTrade}>提交交易</button>
      <p>交易状态：{tradeStatus}</p>
    </div>
  );
}

export default Trading;
