
$(function () {
    var form = layui.form
    var layer = layui.layer
    // 注册和登录块的切换
    // 点击注册链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show();
    })

    // 点击登录链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 自定义表单验证规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        repwd: function(value, item) {
            let pwd = $('#form_reg [name=password]').val()
            console.log('pwd:' + pwd);
            if (pwd != value) {
                return '两次密码不一致'
            }
        }
    })  
    
    
    // 监听注册表单的提交事件
   
    $('#form_reg').on('submit', function (e) {
        //阻止默认提交
        e.preventDefault()
        let data = {username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val(),}
        $.post('/api/reguser', data, 
            function (res) { 
                if (res.status != 0) {
                    return layer.msg('注册失败！' + res.message);
                }
                layer.msg('注册成功！');
                // 注册成功后跳转到登录
                $('#link_login').click()
             }
            )
    });

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) return layer.msg('登录失败！')
                layer.msg('登陆成功！')
                console.log(res.token);
                // 把身份认证的token存储到浏览器本地
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        });
    });
  })

