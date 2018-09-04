'use strict';

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var _user = require('service/user-service.js');
var _mm = require('util/mm.js');
var templateIndex = require('./index.string');

var page = {
  init: function(){
    this.onLoad();
    this.bindEvent();
  },
  onLoad: function(){
    // 初始化左侧菜单
    navSide.init({
      name: 'user-center'
    });
    // 加载用户信息
    this.loadUserInfo();
  },
  bindEvent: function(){
    // 利用事件冒泡原理
    var _this = this;
    $(document).on('click', '.btn-submit', function(){
      var userInfo = {
        phone: $.trim($('#phone').val()),
        email: $.trim($('#email').val()),
        question: $.trim($('#question').val()),
        answer: $.trim($('#answer').val())
      },
      // 验证获取到的信息不是空的
      validateResult = _this.validateForm(userInfo);
      if(validateResult.status){
        // 发送请求，更改用户信息
        _user.updateUserInfo(userInfo, function(res, msg){
          _mm.successTips(msg);
          window.location.href = './user-center.html';
        }, function(errMsg){
          _mm.errorTips(errMsg);
        });
      }else{
        _mm.errorTips(validateResult.msg);
      }
    })
  },
  loadUserInfo: function(){
    // 发送AJAX请求接口，获取用户个人信息
    var userHtml = '';
    _user.getUserInfo(function(res){
      userHtml = _mm.renderHtml(templateIndex, res);
      $('.panel-body').html(userHtml);
    },function(errMsg){
      _mm.errorTips(errMsg);
    });
  },
  validateForm: function(formData){
    var result = {
      status: false,
      msg: ''
    };
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
