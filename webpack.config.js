var webpack = require('webpack');
// 把css单独打包到文件里
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

//环境变量的配置：dev/online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

//获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name, title){
  return {
    template: './src/view/'+name+'.html',
    filename: 'view/'+name+'.html',
    title: title,
    inject: true,
    hash: true,
    chunks: ['common',name]
  };
};

//webpack config
var config = {
  entry: {
    'common': ['./src/page/common/index.js'],
    'index': ['./src/page/index/index.js'],
    'user-login': ['./src/page/user-login/index.js'],
    'user-register': ['./src/page/user-register/index.js'],
    'user-pass-reset': ['./src/page/user-pass-reset/index.js'],
    'user-center': ['./src/page/user-center/index.js'],
    'user-center-update': ['./src/page/user-center-update/index.js'],
    'user-pass-update': ['./src/page/user-pass-update/index.js'],
    'result': ['./src/page/result/index.js']
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
  //路径太长，配置别名
  resolve: {
    alias: {
      // __dirname表示当前的根目录
      util: __dirname + '/src/util',
      page: __dirname + '/src/page',
      service: __dirname + '/src/service',
      image: __dirname + '/src/image',
      node_modules: __dirname + '/node_modules'
    }
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
    new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
    new HtmlWebpackPlugin(getHtmlConfig('user-login', '用户登录')),
    new HtmlWebpackPlugin(getHtmlConfig('user-register', '用户注册')),
    new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset', '重置密码')),
    new HtmlWebpackPlugin(getHtmlConfig('user-center', '个人中心')),
    new HtmlWebpackPlugin(getHtmlConfig('user-pass-update', '修改密码')),
    new HtmlWebpackPlugin(getHtmlConfig('user-center-update', '修改个人信息')),
    new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果'))
  ]
};

if('dev' === WEBPACK_ENV){
  config.entry.common.push('webpack-dev-server/client?http://localhost:8080/');
}
module.exports = config;