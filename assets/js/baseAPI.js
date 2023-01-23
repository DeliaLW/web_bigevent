// 每次调用ajax前，调用这个函数
// 拿到配置对象
$.ajaxPrefilter(function(options) {
    // console.log(options.url);
    options.url = 'http://www.liulongbin.top:3007' + options.url
    // console.log(options.url);
    // 设置headers
    if (options.url.indexOf('/my/') != -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局挂载complete函数
    // 无论请求失败or成功都会执行这个回调函数
    options.complete = function (response) {
        // console.log(response);
        if (response.responseJSON.status == 1 && response.responseJSON.message == '身份认证失败！') {
            // 清空token
            localStorage.removeItem('token')
            // 强制跳转
            location.href = '/login.html'
        }
      }
})

