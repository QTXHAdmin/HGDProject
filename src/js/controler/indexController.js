// 1.配置依赖的模块的路径
require.config({
    shim: {
        easyui: ['jquery'],
        easyuizc: ['jquery']
    },
    paths: {
        jquery: '/lib/jquery.min', // 因为是以src为网站根目录所以前面的/src可以去掉，设置这个psths的时候不要加后缀.js
        api: '/js/service/api',
        tpl: '/js/template/tpl',
        easyui: '/lib/jquery-easyui-1.5.5.2/jquery.easyui.min',
        easyuizc: '/lib/jquery-easyui-1.5.5.2/locale/easyui-lang-zh_CN.js'
    }
});
// 2.进行进口处理：第一个参数依赖的包，回调函数中的第一个参数是对应的第一个参数的包，一一对应
require(['jquery', 'api', 'tpl', 'easyui', 'easyuizc'], function($, api, easyui, easyuizc) {
    $(function() {

    });
});