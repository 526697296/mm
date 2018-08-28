// =====引入header.html css样式=====
'use strict';
require('./index.css');

var _mm = require('util/mm.js');

// 通过页面头部
var header = {
  init: function(){
    this.bindEvent();
    this.onLoad();
    // return this;
  },
  onLoad: function(){
    var keyword = _mm.getUrlParam('keyword');
    //keyword存在，回填到Input输入框
    if(keyword){
      $('#search-input').val(keyword);
    }
  },
  bindEvent: function(){
    // alert(2);
    // 缓存this
    var _this = this;
    //点击搜索按钮以后，做搜索提交。
    $('#search-btn').click(function(){
      // alert(1);
      _this.searchSubmit();
    });
    //按回车键提交
    $('#search-input').keyup(function(e){
      if(e.keyCode === 13){
        _this.searchSubmit();
      }
    });
  },
  // 搜索的提交
  searchSubmit: function(){
    // 获取到input里面的val
    var keyword = $.trim($('#search-input').val());
    //如果提交的时候有keyword,跳转到List.html页面
    if(keyword){
      window.location.href = './list.html?keyword=' + keyword;
    }
    //如果提交的时候，input中没有值，跳转到Index.html页面
    else{
      _mm.goHome();
    }
  }
};

header.init();