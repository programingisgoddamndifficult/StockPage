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
      console.log('正在发送交易请求...');
      const response = await fetch(`http://127.0.0.1:12345/trade?username=${username}&code=${stockCode}&direction=${direction}&price=${price}&amount=${amount}`);
      console.log('收到交易请求的响应:', response);
      const data = await response.json();
      console.log('解析交易请求的响应数据:', data);
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
      {/* 根据交易状态显示相应的提示信息 */}
      {tradeStatus === '委托成功' && <p>委托成功</p>}
      {tradeStatus === '交易成功' && <p>交易成功</p>}
      {tradeStatus === '废单' && <p>废单</p>}
      {tradeStatus === '交易失败' && <p>交易失败</p>}
    </div>
  );
}

export default Trading;
