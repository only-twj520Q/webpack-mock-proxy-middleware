const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { showError, showWarn, showTip, clearCacheAndRequire, isArray, isString, compose, getSingle, getSingleEvent } = require('../utils');
const { FILE_CHANGE } = require('../common/constants');

const FILE_TYPE = ['.js'];
const commonEvent = getSingleEvent();

function getCorrectPath(pathMap) {
  if (!pathMap) {
    return showError('mock配置文件路径为空');
  }
  if (!(isArray(pathMap) || isString(pathMap))) {
    return showError('mock配置文件路径不合法，目前仅支持字符串和数组');
  }
  let pathMapArr = [pathMap];
  if (isArray(pathMap)) {
    pathMapArr = [...pathMap];
  }
  return pathMapArr.map(eachPath => {
    if (!checkPathValidate(eachPath)) {
      return;
    }
    return eachPath;
  }).filter(Boolean);
}

function checkPathValidate(eachPath) {
  if (!fs.existsSync(eachPath)) {
    showError(`${eachPath}路径不存在`);
    return false;
  }
  if (!FILE_TYPE.includes(path.extname(eachPath))) {
    showWarn(`文件类型现在只支持js类型`);
    return false;
  }
  return true;
}

function readConfig(path) {
  return path.map(eachPath => {
    return clearCacheAndRequire(eachPath)
  })
}

function watchFile(correctPathMap) {
  const watcher = chokidar.watch(correctPathMap, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });
  watcher.on('change', () => {
    showTip('文件改变了');
    commonEvent.emit(FILE_CHANGE);
  })
  return correctPathMap;
}

const handlePath = compose(readConfig, getSingle(watchFile), getCorrectPath);

module.exports = handlePath;
