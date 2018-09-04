// ===user-login.html js===
'use strict';

require('./index.css');
require('page/common/nav-simple/index.js');

var _mm = require('util/mm.js');
var _user = require('service/user-service.js');

// 表单里的错误提示
var formError = {
  show: function(errMsg){
    $('.error-item').show().find('.err-msg').text(errMsg);
  },
  hide: function(){
    $('.error-item').hide().find('.err-msg').text('');
  }
};
//===user-login.html js逻辑部分===
var page = {
  init: function(){
    this.bindEvent();
  },
  bindEvent: function(){
    var _this = this;
    //登录按钮的点击
    $('#submit').click(function(){
      _this.submit();
    });
    //回车键提交
    $('.user-content').keyup(function(e){
      if(e.keyCode === 13){
        _this.submit();
      }
    });
  },
  // 提交表单
  submit: function(){
    //拿到输入框中用户输入的val值
    var formData = {
        username: $.trim($('#username').val()),
        password: $.trim($('#password').val())
      },
      //表单验证结果
      validateResult = this.formValidate(formData);
      if(validateResult.status){
        //成功,发送请求
        // _user.login(formData, function(res){
        //   window.location.href = _mm.getUrlParam('redirect') || './index.html';
        // }, function(errMsg){
        //   formError.show(errMsg);
        // });
        _mm.request({
          url     : _mm.getServerUrl('/user/login.do'),
          data    : formData,
          method  : 'POST',
          success : function(res){
            window.location.href = _mm.getUrlParam('redirect') || './index.html';
          },
          error   : function(errMsg){
            formError.show(errMsg);
          }
        });
      }else{
        //失败
        formError.show(validateResult.msg);
      }
  },
  //表单验证
  formValidate: function(formData){
    var result = {
      status: false,
      msg: ''
    };
    if(!_mm.validate(formData.username, 'require')){
      result.msg = '用户名不能为空';
      return result;
    }
    if(!_mm.validate(formData.password, 'require')){
      result.msg = '密码不能为空';
      return result;
    }
    //验证通过，返回正确的提示
    result.status = true;
    result.msg = '验证通过';
    return result;
  }
};
$(function(){
  page.init();
});
