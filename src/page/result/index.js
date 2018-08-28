// =====result.html=====
'use strict';

// =====引入result.html css=====
require('./index.css');

//=====引入通用nav-simple.html css and js=====
require('page/common/nav-simple/index.js');

// ===引入工具函数库===
var _mm = require('util/mm.js');

$(function(){
  var type = _mm.getUrlParam('type') || 'default',
      $element = $('.' + type + '-success');
  // ===显示对应的提示元素===
  $element.show();
})