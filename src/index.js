'use strict';

const handlePath  = require('./helpers/handlePath');
const handleMock  = require('./helpers/handleMock');
const handleProxy  = require('./helpers/handleProxy');
const handleApiConfig  = require('./helpers/handleApiConfig');
const { showWarn, preHandleFilePath, getSingleEvent } = require('./utils');
const commonConfig = require('./common/config');
const { FILE_CHANGE, FILE_READ_COMPLETE } = require('./common/constants');

const isEnvProduction = process.env.NODE_ENV === 'production';

const commonEvent = getSingleEvent();

// 浏览器刷新
function watchCallback(server) {
  if (server) {
    server.sockWrite(server.sockets, 'content-changed');
  } else {
    console.log(showWarn('对不起，您没有传入server对象，无法使用浏览器自动刷新功能！'));
  }
}

// 获取配置文件
function getConfig(app, server, pathMap) {
  let configs = handlePath(pathMap);
  if (!configs) {
    app.use((req, res, next) => {
      next();
    })
    return;
  }
  let configMap = configs.reduce((total, cur) => ({...total, ...cur}), {});
  commonConfig.setConfig(configMap);
  return configMap;
}

function devServerMiddle(app, server, pathMap) {
  commonEvent.on(FILE_CHANGE, () => {
    getConfig(app, server, pathMap);
    commonEvent.emit(FILE_READ_COMPLETE);
    watchCallback(server);
  })
  let configMap = getConfig(app, server, pathMap);
  Object.entries(configMap).forEach(config => {
    const [ route ] = config;
    const correctRoute = preHandleFilePath(route);
    handleApiConfig(app, correctRoute, route);
    handleMock(app, correctRoute, route);
    handleProxy(app, correctRoute, route);
  })
}

module.exports = devServerMiddle;

