var layer = layui.layer
// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}
// 1.3 创建裁剪区域
$image.cropper(options)

// 上传图片
$('#upload').on('click', function () {
    $('#file').click()
  })
$('#btn-upload-confirm').on('click', function () {
    // 1. 要拿到用户裁剪之后的头像
    var dataURL = $image
        .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
        })
        .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    $.ajax({
        type: "POST",
        url: "/my/update/avatar",
        data: {
            avatar: dataURL
        },
        success: function (response) {
            if (response.status != 0) {
                return layer.msg('更新头像失败！')
            }
            window.parent.getUserInfo()
            layer.msg('更新头像成功！')
        }
    });
  })

$('#file').on('change', function (e) {
    let filelist = e.target.files
    console.log(filelist);
    if (filelist.length == 0) {
        layer.msg('请选择图片！')
    }
    let file = filelist[0]
    let imgURL = URL.createObjectURL(file)
    // 初始化裁剪区域
    $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
});