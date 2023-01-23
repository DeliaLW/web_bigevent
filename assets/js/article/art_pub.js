$(function() {
    var layer = layui.layer
    var form = layui.form
    // 初始化富文本编辑器
    initEditor()
    initCate()

    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (response) {
                if (response.status != 0) {
                    console.log('失败');
                    return layer.msg('失败')
                }
                console.log('成功！');
                console.log(response);
                let htmlStr = template('tpl-cate', response)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面按钮绑定事件
    $('#btn-choose-cover').on('click', function() {
        $('#coverFile').click()
    })
    // 图片选择区域change事件监听
    $('#coverFile').on('change', function (e) {
        let files = e.target.files
        if (files.length == 0) {
            return
        }
        // 把文件转化为URL地址
        let newImgURL = URL.createObjectURL(files[0])
        $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', newImgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
       

    });

     // 定义文章的发布状态
     var artState = "已发布"
     // 存为草稿按钮绑定事件
     $('#btn-draft').on('click', function () {
         artState = "草稿"
     });
     // 为表单绑定submit事件
     $('#form-pub').on('submit', function (e) {
         console.log('gggggg');
         e.preventDefault()
         // 基于form表单，快速创建一个FormData对象
         let fd = new FormData($(this)[0])
         fd.append('state', artState)
         fd.forEach(function(v, k) {
             console.log(k, v)
         })
          // 将裁剪后的图片，输出为文件
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) { 
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob)
            publishArticle(fd)
        })

     });
     function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // 向服务器提交formdata格式的数据，必须配置以下两个
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.status != 0) {
                    console.log(response);
                    layer.msg('发布文章失败')
                    return console.log('发布文章失败！');
                }
                layer.msg('发布文章成功！')
                console.log(response);
                location.href = '../../../article/art_list.html'
            }
        });
       }
})