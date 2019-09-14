const chalk = require('chalk');
const path = require('path');
const events = require('events');

/**
 * chalk提示信息规范，红色错误，黄色警告，绿色提示
 * @param {String} color 颜色
 */
const chalklog = color => msg => console.log(chalk[color](msg));
const showError = msg => {
  chalklog('red')(msg);
  process.exit(1);
}
const showWarn = chalklog('yellow');
const showTip = chalklog('green');

/**
 * 判断数据类型
 * @param {String} type 判断js数据类型
 */
const isType = type => target => `[object ${type}]` === Object.prototype.toString.call(target);
const isArray = isType('Array');
const isString = isType('String');
const isFunction = isType('Function');
const isNumber = isType('Number');

/**
 * 无缓存引入
 * @param {String} path
 */
const clearCacheAndRequire = path => {
  delete require.cache[path];
  return require(path);
}

/**
 * 函数组合
 * @param {Array} funcs
 * @return {Function} 合并后的函数
 */
const compose = (...funcs) => {
  if (funcs.length === 0) {
    return arg => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

/**
 * 合并参数，无论参数是在url上还是在body上，最终会合并成一个参数，且body会覆盖query的同名参数
 * @param {Object} query url上带的参数
 * @param {Object} body body上带的参数
 * @return {Object} 合并后的参数对象
 */
const mergeParams = (query = {}, body = {}) => {
  return Object.assign({}, query, body);
}

/**
 * 预处理文件路径，统一成有首位有斜杠，末尾无斜杠，比如/api/mock/v1
 * @param {string} filePath
 * @return {string}
 */
const preHandleFilePath = filePath => {
  if (!filePath) {
    return '';
  }
  filePath = path.normalize(filePath);
  if (!filePath.startsWith('/')) {
    filePath = `/${filePath}`;
  }
  if (filePath.endsWith('/')) {
    filePath = filePath.slice(0, -1);
  }
  return filePath;
}

/**
 *
 * 单例模式，创建单例
 * @param {Function} filePath
 * @return {Function}
 */
const getSingle = function(fn) {
  let result;
  return function(...args) {
    if (!result) {
      result = fn.apply(this, args);
    }
    return result;
  }
}

const getEvent = () => new events.EventEmitter();

const getSingleEvent = getSingle(getEvent);

module.exports = {
  showError,
  showWarn,
  showTip,
  isArray,
  isString,
  isFunction,
  isNumber,
  clearCacheAndRequire,
  compose,
  mergeParams,
  preHandleFilePath,
  getSingle,
  getSingleEvent
}
