// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // header配置，需要加个身份认证的token
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (response) {
            if (response.status == 1) return console.log('获取用户消息失败！'+response.message);
            // TODO渲染用户头像、名称
            console.log(response.data);
            renderAvatar(response.data)
        },
        // // 无论请求失败or成功都会执行这个回调函数
        // complete: function (response) {
        //     console.log(response);
        //     if (response.responseJSON.status == 1 && response.responseJSON.message == '身份认证失败！') {
        //         // 清空token
        //         localStorage.removeItem('token')
        //         // 强制跳转
        //         location.href = '/login.html'
        //     }
        //   }
    });
  }
//   渲染用户头像，名称
function renderAvatar(user) {
    // 名称
    let name = user.nickname || user.username
    // 头像
    let pic = user.user_pic
    $('#welcom').html('欢迎&nbsp' + name)
    if (pic != null) {
        // 用户有设置头像
        $('.layui-nav-img').attr('src', pic)
        $('.layui-nav-img').show()
        $('.text-avatar').hide()
    } else {
        // 用户没有设置头像
        $('.layui-nav-img').hide()
    }
  }

// 退出登录功能
let layer = layui.layer
// 点击退出按钮
$('#logout').on('click', function() {
    // 提示用户是否退出
    layer.confirm('确定是否退出', {icon:3, title: '提示'}, function (index) {
        // 清空本地存储的token
        localStorage.removeItem('token')
        // 重新跳转到登录页面
        location.href = '/login.html'
        // 关闭conform提示框
        layer.close(index)
      })
})
getUserInfo()

