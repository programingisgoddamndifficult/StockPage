实现一个简单的股票交易系统

功能说明：
1、系统支持两种角色：游客和登陆用户，不同角色的功能不同。
对于游客，可以使用的功能（图1）包括：注册、登陆、浏览大盘行情、浏览个股实时行情;
![image](https://github.com/programingisgoddamndifficult/StockPage/assets/90440706/6a0a76aa-3840-45b1-904a-a33a4cd7ba68)

其中：
- [x]  a)游客注册时需要输入用户名、密码、确认密码，在页面上使用JS检查后两者是否一致，一致时将信息返回后端，完成注册。注册后用户默认的账户与、额是10000元。
- [x]  b)游客登陆时需要输入用户名、密码，页面将信息返回后端进行比较，并根据结果提示登陆失败或跳转到已登陆页面。
- [x]  c)浏览大盘行情时，根据后端返回的股票代码，将所有股票分为三部分展示（可自由切换）：沪市（6开头）、深市（3开头）、创业板（0开头）。所有股票的信息以表格的形式展示，每行展示一支股票，展示的信息包括：代码、名称、最新价格、当日涨跌幅、当日涨跌价。页面需要定时（显示倒计时）向后端获取数据，以刷新页面中的股票数据。
- [x]  d)选择具体股票后，可以浏览以曲线的形式展示的股票实时行情。页面需要定时（显示倒计时）向后端获取数据，以刷新页面中的股票数据。
3、对于登陆用户，可以使用的功能（图2）包括：注销、浏览大盘行情、浏览个股实时行情、交易股票、查看持仓、查看交易记录。
![image](https://github.com/programingisgoddamndifficult/StockPage/assets/90440706/c95b0558-eb63-4f4b-8bbc-a0c3609c45e3)

其中：
- [x]  a)登陆用户注销后，将返回游客页面。
- [x]  b)浏览大盘行情和浏览个股实时行情功能与游客相应功能一致。
- [x]  c)登陆用户可以选择某支股票，输入交易类型、数量和价格进行交易。并根据后端返回的数据，在页面显示委托成功、交易成功、废单等提示。
- [x]  d)登陆用户可以查看自己的持仓，页面以表格的形式展示当前用户的账户余额以及所有已买入且未卖出的股票信息，包括：代码、名称、买入价格、最新价格、盈亏金额。页面需要定时（显示倒计时）向后端获取数据，以刷新页面中的股票数据。
- [x]  e)登陆用户可以查看自己的交易记录，页面以表格的形式展示当前用户的账户余额以及所有买入、卖出的记录，包括：交易时间、代码、名称、交易方向、金额、数量。

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
