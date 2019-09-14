const delayRes = time => (req, res, next) => {
  setTimeout(() => next(), time);
}

const randomSuccessRes = rate => (req, res, next) => {
  if (rate > Math.random()) return next();
  return res.status(500).send('服务器错误');
}

const setCorsHeader = () => (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
}

module.exports = {
  delayRes,
  randomSuccessRes,
  setCorsHeader
}
