$(function() {
    var layer = layui.layer
    var indexAdd = null
    var indexEdit = null
    var form = layui.form

    initArticleList()

    // 获取文章分类列表数据
    function initArticleList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (response) {
                if (response.status != 0) {
                    return console.log('失败！');
                }
                // console.log(response);
                let htmlStr = template('tpl-table', response.data)
                $('tbody').html(htmlStr)
            }
        });
      }
    

    // 点击添加按钮弹出表单
    $('#btn-add').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    });


    // 给表单绑定提交事件
    // 因为这个弹出的表单，是点击按钮后才生成的，所以直接给表单绑定监听是无法成功的
    // 必须采用代理的形式，给body绑定监听事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // 给服务器提交数据
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (response) {
                if (response.status != 0) {
                    layer.msg('添加文章分类失败！')
                    return console.log(response);
                }
                layer.msg('添加文章分类成功！')
                initArticleList()
                // 关闭弹出层
                layer.close(indexAdd)
            }
        });
    });

    // 通过代理形式，为btn-edit绑定事件
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        let id = $(this).attr('data-id')
        // 获取对应数据并渲染
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id ,
            success: function (response) {
                if (response.status != 0) {
                    console.log('失败');
                    return
                }
                form.val('form-edit', response.data)
            }
        });
    });
    // 通过代理形式，为修改提交绑定事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (response) {
                if (response.status != 0) {
                    console.log(response);
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArticleList()
            }
        });
        
    });

    // 通过代理形式，为btn-del绑定事件
    $('tbody').on('click', '#btn-del', function () {
        let id = $(this).attr('data-id')
        layer.confirm('确认要删除吗？', {icon:3, title: '提示'}, function(index) {
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (response) {
                    if (response.status != 0) {
                        console.log(response);
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    layer.close(index)
                    initArticleList()
                }
            });
        })
    })

})