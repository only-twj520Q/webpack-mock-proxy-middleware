const url = require('url');
const path = require('path');
const pathToRegexp = require('path-to-regexp');
const { delayRes, randomSuccessRes, setCorsHeader } = require('../middlewares');
const { FILE_READ_COMPLETE } = require('../common/constants');
const { isNumber, showWarn, getSingleEvent } = require('../utils');

const commonEvent = getSingleEvent();
let commonConfig;
commonEvent.on(FILE_READ_COMPLETE, () => {
  commonConfig = require(path.resolve(__dirname, '../common/config')).getConfig();
})

const middlewaresMap = {
  timeout: {
    validate: timeout => {
      if (!isNumber(timeout)) {
        showWarn('timeout必须是一个数字');
        return false;
      }
      return true;
    },
    use: delayRes
  },
  rate: {
    validate: rate => {
      if (!isNumber(rate)) {
        showWarn('rate必须是一个数字');
        return false;
      }
      if (rate > 1 || rate < 0) {
        showWarn('rate必须在0-1之间');
        return false;
      }
      return true;
    },
    use: randomSuccessRes
  },
  cors: {
    validate: _ => true,
    use: setCorsHeader
  }
}

function handleApiConfig(app, correctRoute, route) {
  commonConfig = require(path.resolve(__dirname, '../common/config')).getConfig();
  Object.keys(commonConfig[route].apiConfig).forEach(apiConfigKey => {
    app.use((req, res, next) => {
      const pathReg = pathToRegexp(correctRoute, [], {
        sensitive: false,
        end: true,
        strict: true
      });
      const { pathname } = url.parse(req.url, true);
      const { apiConfig } = commonConfig[route];
      const middlewareParam = apiConfig[apiConfigKey];
      const middleware = middlewaresMap[apiConfigKey];
      if (!middleware.validate(middlewareParam) || !pathReg.exec(pathname)) {
        next();
      } else {
        middleware.use(middlewareParam)(req, res, next);
      }
    });
  })
}

module.exports = handleApiConfig;
