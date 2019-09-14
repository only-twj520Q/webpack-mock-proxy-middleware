# webpack-mock-proxy-middleware
## 说明
这是一个`webpack-dev-server`的中间件。主要作用有两个
1. 本地mock数据
2. 代理接口

这个插件的目的是解决前端开发过程中过度依赖后端接口协议的尴尬。



## 使用

```javascript
const mockProxyMiddleware = require('webpack-mock-proxy-middleware');

devServer: { 
  before: function(app, server) {
    mockProxyMiddleware(app, server, getEntry('mock.js'));
  });
}
```



## 配置文件规范

目前支持js文件类型，遵循node模块规范，使用`module.exports`导出一个对象。

对象是每个接口的配置项。每个配置项是一个对象。接口名是key，配置内容是value。

接口名是接口的路径，尽量规范，前后斜杠可以忽略，插件会自动匹配。

配置内容是一个对象，可以支持proxyTarget，mockData，apiConfig这三个字段。

```javascript
'api/hotel/list/v2/': {
  proxyTarget: {
    enable: true,
    target: 'https://xxx.xxx.com'
  },
  mockData: {
    enable: true,
    method: 'post',
    data: {},
  },
  apiConfig: {
    timeout: 2000,
    rate: 0.5
  }
}
```



## 配置说明

### mockData

这是用来配置mock数据。它是一个对象。

#### 字段说明

* enable是开关，true的时候可以打开，false的时候关闭。
* method是请求方式。目前支持常见的post和get

* data字段是mock数据，可以是一个对象，也可以是一个函数，函数的参数是url query上或者post请求体中解析以后的对象，我们可以在其中根据请求内容自定义返回的结果。比如

  ```javascript
  mockData: {
    enable: true,
    method: 'post',
    data(param) {
      if (param.number > 10) {
        return {
          msg: '成功啦'
        }
      } else {
        return {
          msg: '失败啦'
        }
      }
    }
  },
  ```

### proxyTarget

这是用来代表的相关配置

#### 字段说明

* enable是开关，true的时候可以打开，false的时候关闭。
* target是开发者代理的目标服务器。

### apiConfig

这是用来配置接口的额外配置。目前只支持timeout和rate。

#### 字段说明

* timeout代表接口延迟时间
* rate代表接口成功的概率。



## 插件优势

* 配置内容变化，文件重新读取，浏览器刷新。
* 模拟(mock)和代理(proxy)使用一个配置文件，让开发变得更easy。
* 接口中间件配置。实现常见的接口场景。



##注意事项

目前不支持动态增加配置。比如当前只配置了a接口的相关配置，但是增加了b接口的配置，此时必须重启项目才能生效。



## TODO

项目开发方面。规范方面，增加eslint配置，增加单元测试模块；代码方面，需要考虑更多的使用场景和边界case，提高代码的鲁棒性。

提供更加丰富的内置中间件配置。

支持开发者使用自定义中间件。

支持更多的配置文件格式。

提供更加丰富的插件使用方式。

