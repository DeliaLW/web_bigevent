$(function() {
    var layer = layui.layer
    var form = layui.form
    // 校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须为6-12位，且不能出现空格'],
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
          },
        rePwd: function (value) {
            if (value != $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
          }
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (response) {
                if (response.status != 0) {
                    return layer.msg('更新密码失败！')
                }
                layer.msg('更新密码成功！')
                $('[name=oldPwd]').val('')
                $('[name=newPwd]').val('')
                $('#input-rePwd').val('')
                // 或者
                // $('.layui-form')[0].reset()
            }
        });
    });
})