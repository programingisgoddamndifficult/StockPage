const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/getStockPrice',
    createProxyMiddleware({
      target: 'http://127.0.0.1:12345',
      changeOrigin: true,
    })
  );
};
