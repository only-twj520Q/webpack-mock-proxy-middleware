module.exports = {
  'j/search_subjects': {
    proxyTarget: {
      enable: true,
      target: 'https://movie.douban.com'
    },
    mockData: {
      enable: false,
      data: {
        text: '这是mock的数据'
      }
    },
    apiConfig: {
      timeout: 1000,
      rate: 1
    }
  }
}
