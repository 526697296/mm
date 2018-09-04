// ===user-pass-reset.html js===
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
//===user-pass-reset.html js逻辑部分===
var page = {
  data: {
    username: '',
    question: '',
    answer: '',
    token: ''
  },
  init: function(){
    this.onLoad();
    this.bindEvent();
  },
  onLoad: function(){
    this.loadStepUsername();
  },
  bindEvent: function(){
    var _this = this;
    //下一步按钮的点击
    $('#submit-username').click(function(){
      // 提取用户输入的用户名
      var username = $.trim($('#username').val());
      // 判断用户名是否为空
      if(username){
        //如果用户输入的用户名不是空的，发送请求进行下一步
        _user.getQuestion(username, function(res){
          _this.data.username = username;
          _this.data.question = res;
          _this.loadStepQuestion();
        },function(errMsg){
          formError.show(errMsg);
        });
      }else{
        formError.show('请输入用户名');
      }
    });
    $('#submit-question').click(function(){
      // 提取密保答案
      var answer = $.trim($('#answer').val());
      // 判断是否为空
      if(answer){
        //如果用户输入的不是空的，发送请求进行下一步
        _user.checkAnswer({
          username: _this.data.username,
          question: _this.data.question,
          answer: answer
        }, function(res){
          _this.data.answer = answer;
          _this.data.token = res;
          _this.loadStepPassword();
        },function(errMsg){
          formError.show(errMsg);
        });
      }else{
        formError.show('请输入密保答案');
      }
    });
    $('#submit-password').click(function(){
      // 提取用户输入的用户名
      var password = $.trim($('#password').val());
      // 判断用户名是否为空
      if(password && password.length >= 6){
        //如果用户输入的用户名不是空的，发送请求进行下一步
        _user.resetPassword({
          username: _this.data.username,
          passwordNew: password,
          forgetToken: _this.data.token
        }, function(res){
          window.location.href = './result.html?type=pass-reset';
        },function(errMsg){
          formError.show(errMsg);
        });
      }else{
        formError.show('请输入新的密码');
      }
    });
  },
  //加载输入用户名的一步
  loadStepUsername: function(){
    $('.step-username').show();
  },
  //加载输入密保问题的一步
  loadStepQuestion: function(){
    // 隐藏之前所有的错误提示
    formError.hide();
    //上一屏用户名隐藏，2屏切换
    $('.step-username').hide().siblings('.step-question').show().find('.question').text(this.data.question);
  },
  //加载输入新的用户名密码的一步
  loadStepPassword: function(){
    formError.hide();
    $('.step-question').hide().siblings('.step-password').show();
  }
};
$(function(){
  page.init();
});
