const bodyParser = require('body-parser');
const url = require('url');
const path = require('path');
const { isFunction, mergeParams, getSingleEvent } = require('../utils');
const { FILE_READ_COMPLETE } = require('../common/constants');

const commonEvent = getSingleEvent();
let commonConfig;
commonEvent.on(FILE_READ_COMPLETE, () => {
  commonConfig = require(path.resolve(__dirname, '../common/config')).getConfig();
})

function getResult(req, mockData) {
  const { query } = url.parse(req.url, true);
  let params = query;
  if (mockData.method && mockData.method.toUpperCase() === 'POST') {
    params = mergeParams(query, req.body);
  }
  let result = mockData.data;
  if (isFunction(mockData.data)) {
    result = mockData.data(params);
  }
  return result;
}

function doGetRequest(app, correctRoute, route) {
  app.get(correctRoute, (req, res, next) => {
    const { mockData } = commonConfig[route];
    if (!mockData.enable) {
      return next();
    }
    let result = getResult(req, mockData);
    return res.status(200).json(result);
  })
}

function doPostRequest(app, correctRoute, route) {
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))
  // parse application/json
  app.use(bodyParser.json());
  app.post(correctRoute, (req, res, next) => {
    const { mockData } = commonConfig[route];
    if (!mockData.enable) {
      return next();
    }
    let result = getResult(req, mockData);
    return res.status(200).json(result);
  })
}

function handleMock(app, correctRoute, route) {
  commonConfig = require(path.resolve(__dirname, '../common/config')).getConfig();
  const { method } = commonConfig[route].mockData;
  if (method && method.toUpperCase() === 'POST') {
    doPostRequest(app, correctRoute, route);
    return;
  }
  doGetRequest(app, correctRoute, route);
}

module.exports = handleMock;
