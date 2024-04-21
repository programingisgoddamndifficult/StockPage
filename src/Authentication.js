import React, { useState } from 'react';

function Authentication({ handleRegister, handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <h1>用户认证</h1>
      <input type="text" placeholder="用户名" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>注册</button>
      <button onClick={handleLogin}>登录</button>
    </div>
  );
}

export default Authentication;
