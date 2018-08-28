//工具函数的封装
'use strict';
var Hogan = require('hogan.js');
var conf = {
  serverHost : ''
};
var _mm = {
  // 1:请求后端数据,参数param可以是一个对象
  request: function(param){
    //缓存this
    var _this = this;
    $.ajax({
      //请求类型：没有指定则默认get
      type: param.method || 'get',
      url: param.url || '',
      //数据接口
      dataType: param.type || 'json',
      data: param.data || '',
      //成功回调
      success: function(res){
        //0是自己定义的接口，请求成功
        if(0 === res.status){
          //判断param.success是不是function,信息才会返回回去
          typeof param.success === 'function' && param.success(res.data, res.msg);
        }
        //如果res.ststus === 10 的话，是需要强制登入的
        else if(10 === res.status){
          _this.doLogin();
        }
        //接口请求成功，但是数据是错误的
        else if(1 === res.status){
          typeof param.error === 'function' && param.error(res.msg);
        }
      },
      //请求失败,404,503
      error: function(err){
        //字段在statusText
        typeof param.error === 'function' && param.error(err.statusText);
      }
    })
  },
  //获取服务器地址
  getServerUrl: function(path){
    return conf.serverHost + path;
  },
  //获取URL参数
  getUrlParam: function(name){
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    //substr(1)将?去掉，剩下key-value
    var result = window.location.search.substr(1).match(reg);
    //返回并解码
    return result ? decodeURIComponent(result[2]) : null;
  },
  //渲染html模板
  renderHtml : function(htmlTemplate, data){
    var template    = Hogan.compile(htmlTemplate),
        result      = template.render(data);
    return result;
  }, 
  //成功提示
  successTips: function(msg){
    alert(msg || '操作成功');
  },
  //错误提示
  errorTips: function(msg){
    alert(msg || '操作失败');
  },
  // 字段的验证，支持非空、手机、邮箱的判断
  validate : function(value, type){
    var value = $.trim(value);
    // 非空验证
    if('require' === type){
        return !!value;
    }
    // 手机号验证
    if('phone' === type){
        return /^1\d{10}$/.test(value);
    }
    // 邮箱格式验证
    if('email' === type){
        return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
    }
  },
  //封装一个login登入页面
  doLogin: function(){
    //跳转到login.html页面;处理完登入后，跳转到指定页面，需要encodeURIComponent编码
    window.location.href = './login.html?redirect=' + encodeURIComponent(window.location.href);
  },
  //跳转到首页
  goHome: function(){
    window.location.href = './index.html';
  }
};
//模块化，输出出去
module.exports = _mm;