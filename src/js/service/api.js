/*
 * @Author: zhanghe 
 * @Date: 2018-12-29 10:53:05 
 * @Last Modified by: zhanghe
 * @Last Modified time: 2018-12-29 11:45:34
 * 所有跟后台打交道的API都放到这里
 */
define([
  'jquery'
], function ($) {
  return {
    getUser:function(cb){
      //发送ajax请求，后台返回数据之后，调用cb函数
      $.ajax({
        url:'http://localhost:3000/course',
        type:'GET',
        data:'',
        dataType:'json',
        success:cb
      });
    }
  };
});