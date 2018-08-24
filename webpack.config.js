var webpack = require('webpack');
// 把css单独打包到文件里
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

//环境变量的配置：dev/online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

//获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name){
  return {
    template: './src/view/'+name+'.html',
    filename: 'view/'+name+'.html',
    inject: true,
    hash: true,
    chunks: ['common',name]
  };
};

//webpack config
var config = {
  entry: {
    'common': ['./src/page/common/index.js'],
    'index': ['./src/page/index/index.js']
  },
  output: {
    //存放时的一个路径
    path: './dist',
    //访问时的一个路径
    publicPath : '/dist',
    filename: 'js/[name].js'
  },
  externals:{
    'jquery': 'window.jQuery'
  },
  module: {
    loaders:[
      //把css单独打包到文件里：1=>需要设置ExtractTextPlugin.extract
      {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader","css-loader")},
      { test: /\.string$/, loader: 'html-loader'},
      //limit=100小于这个值，就打包成base64，如果是大于，就以源文件的形式存在
      { test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=100&name=resource/[name].[ext]'}
    ]
  },
  plugins: [
    // 配置：独立通用模块到=>dist/js/base.js
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'js/base.js'
    }),
    // 配置：把css单独打包到文件里：2=>放入dist/css/下
    new ExtractTextPlugin("css/[name].css"),
    //html模板的处理
    new HtmlWebpackPlugin(getHtmlConfig('index'))
  ]
};

if('dev' === WEBPACK_ENV){
  config.entry.common.push('webpack-dev-server/client?http://localhost:8089/');
}
module.exports = config;