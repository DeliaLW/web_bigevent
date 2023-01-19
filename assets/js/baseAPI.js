// 每次调用ajax前，调用这个函数
// 拿到配置对象
$.ajaxPrefilter(function(options) {
    console.log(options.url);
    options.url = 'http://www.liulongbin.top:3007' + options.url
})