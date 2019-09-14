const httpProxyMiddleware = require('http-proxy-middleware');
const path = require('path');
const { FILE_READ_COMPLETE } = require('../common/constants');
const { getSingleEvent } = require('../utils');

const commonEvent = getSingleEvent();
let commonConfig;
commonEvent.on(FILE_READ_COMPLETE, () => {
  commonConfig = require(path.resolve(__dirname, '../common/config')).getConfig();
})

function handleProxy(app, correctRoute, route) {
  commonConfig = require(path.resolve(__dirname, '../common/config')).getConfig();
  const getProxyConfig = (req, res, next) => {
    const { proxyTarget } = commonConfig[route];
    if (!proxyTarget.enable) {
      return next();
    } else {
      const options = {
        context: correctRoute,
        target: proxyTarget.target,
        changeOrigin: true,
        ws: true,
        onProxyRes: function(proxyRes, req, res) {
          proxyRes.headers['x-proxy-by'] = 'h5-proxy';
          proxyRes.headers['x-proxy-match'] = route;
          proxyRes.headers['x-proxy-target'] = proxyTarget.target;
        }
      }
      const proxyConfig = httpProxyMiddleware(correctRoute, options);
      return proxyConfig(req, res, next)
    }
  }
  app.use(correctRoute, getProxyConfig);
}

module.exports = handleProxy;
