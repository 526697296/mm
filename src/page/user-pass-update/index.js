'use strict';

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var _user = require('service/user-service.js');
var _mm = require('util/mm.js');

var page = {
  init: function(){
    this.onLoad();
    this.bindEvent();
  },
  onLoad: function(){
    // 初始化左侧菜单
    navSide.init({
      name: 'user-pass-update'
    });
  },
  bindEvent: function(){
    // 利用事件冒泡原理
    var _this = this;
    $(document).on('click', '.btn-submit', function(){
      var userInfo = {
        password: $.trim($('#password').val()),
        passwordNew: $.trim($('#password-new').val()),
        passwordConfirm: $.trim($('#password-confirm').val())
      },
      // 验证获取到的信息不是空的
      validateResult = _this.validateForm(userInfo);
      if(validateResult.status){
        // 发送请求，更改用户密码
        _user.updatePassword({
          passwordOld: userInfo.password,
          passwordNew: userInfo.passwordNew
        }, function(res, msg){
          _mm.successTips(msg);
        }, function(errMsg){
          _mm.errorTips(errMsg);
        });
      }else{
        _mm.errorTips(validateResult.msg);
      }
    })
  },
  validateForm: function(formData){
    var result = {
      status: false,
      msg: ''
    };
    // 验证密码是否为空
    if(!_mm.validate(formData.password, 'require')){
      result.msg = '密码不能为空';
      return result;
    }
    // 验证新密码长度
    if(!formData.passwordNew || formData.passwordNew < 6){
      result.msg = '密码长度不能小于6位';
      return result;
    }
    // 验证两次密码是否一致
    if(formData.passwordNew !== formData.passwordConfirm){
      result.msg = '2次密码不一致';
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
