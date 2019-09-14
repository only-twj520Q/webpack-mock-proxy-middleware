const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const mockProxyMiddleware = require('webpack-mock-proxy-middleware');

module.exports = {
  entry: {
    index: './src/index'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  devServer: {
    host: 'localhost',
    port: 9090,
    before(app, server) {
      mockProxyMiddleware(app, server, path.resolve(process.cwd(), 'src/pages/mock.js'))
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(css|less)$/,
        exclude: /node_modules/,
        use: ['style-loader','css-loader','less-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    })
  ]
}
