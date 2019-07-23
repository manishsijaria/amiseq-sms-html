const proxy = require('http-proxy-middleware');
const api_url = require('./config')

module.exports = function(app) {
  //app.use(proxy('/api', { target: 'http://[::1]:3001/' }));
  app.use(proxy('/api', { target: api_url }));
};