$(function () {
    var layer = layui.layer
    // input校验规则
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6之间'
            }
          }
    })

    initUserInfo()
    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (response) {
                if (response.status != 0) {
                    return layer.msg(response.message)
                }
                // console.log(response.data);
                form.val('formUserInfo', response.data)
            }
        });
      }

    // 重置功能
    $('#btn-reset').on('click', function (e) {
        // 阻止表单默认重置行为
        e.preventDefault()
        // initUserInfo()
        $('#input-nickname').val('')
        $('#input-email').val('')
    });
    // 提交修改信息的表单
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (response) {
                if (response.status != 0) {
                    return layer.msg('修改失败')
                }
                layer.msg('更新用户信息成功！')
                // 调用父页面的方法刷新用户信息
                window.parent.getUserInfo()
            }
        });
    
        
    });
  })