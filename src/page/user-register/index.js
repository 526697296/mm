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
//===user-register.html js逻辑部分===
var page = {
  init: function(){
    this.bindEvent();
  },
  bindEvent: function(){
    var _this = this;
    //验证username是否符合标准
    $('#username').blur(function(){
      //拿到user输入框用户输入的值
      var username = $.trim($(this).val());
      // 如果用户名为空，则不做验证
      if(!username){
        return;
      }
      //异步验证用户名是否存在
      _user.checkUsername(username, function(res){
        formError.hide();
      },function(errMsg){
        formError.show(errMsg);
      });
    });
    //注册按钮的点击
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
        password: $.trim($('#password').val()),
        passwordConfirm: $.trim($('#password-confirm').val()),
        phone: $.trim($('#phone').val()),
        email: $.trim($('#email').val()),
        question: $.trim($('#question').val()),
        answer: $.trim($('#answer').val())
      },
      //表单验证结果
      validateResult = this.formValidate(formData);
      if(validateResult.status){
        //成功,发送请求
        _user.register(formData, function(res){
          // 注册成功，跳转到结果提示页
          window.location.href = './result.html?type=register';
        }, function(errMsg){
          formError.show(errMsg);
        });
        // _mm.request({
        //   url     : _mm.getServerUrl('/user/login.do'),
        //   data    : formData,
        //   method  : 'POST',
        //   success : function(res){
        //     window.location.href = _mm.getUrlParam('redirect') || './index.html';
        //   },
        //   error   : function(errMsg){
        //     formError.show(errMsg);
        //   }
        // });
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
    //验证用户名是否为空
    if(!_mm.validate(formData.username, 'require')){
      result.msg = '用户名不能为空';
      return result;
    }
    // 验证密码是否为空
    if(!_mm.validate(formData.password, 'require')){
      result.msg = '密码不能为空';
      return result;
    }
    // 验证密码的长度
    if(formData.password.length < 6){
      result.msg = '密码长度不能小于6位';
      return result;
    }
    // 验证用户输入的密码两次是否一致
    if(formData.password !== formData.passwordConfirm){
      result.msg = '两次输入的密码不一致';
      return result;
    }
    // 验证手机号
    if(!_mm.validate(formData.phone, 'phone')){
      result.msg = '手机格式不正确';
      return result;
    }
    // 验证邮箱地址
    if(!_mm.validate(formData.email, 'email')){
      result.msg = '邮箱地址不正确';
      return result;
    }
    // 验证密码提示问题
    if(!_mm.validate(formData.question, 'require')){
      result.msg = '密码提示问题不能为空';
      return result;
    }
    // 验证密码提示我问题答案
    if(!_mm.validate(formData.answer, 'require')){
      result.msg = '答案不能为空';
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
