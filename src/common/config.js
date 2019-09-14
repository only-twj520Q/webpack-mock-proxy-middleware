let commonConfig;

const setConfig = config => {
  commonConfig = config;
}

const getConfig = _ => commonConfig;

module.exports = {
  setConfig,
  getConfig
}
