$(function() {
    var form = layui.form
    var laypage = layui.laypage
    var layer = layui.layer
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize:2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
      }
    // 美化时间格式的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
        
        let y = dt.getFullYear()
        let m = dt.getMonth() + 1
        let d = dt.getDate()

        let hh = dt.getHours()
        let mm = dt.getMinutes()
        let ss = dt.getSeconds()

        return y + '-' + padZero(m) + '-' + padZero(d) + ' ' + padZero(hh) + ':' + padZero(mm) + ':' + ss

    }

    initArticleList()
    initCate()
    // 初始化文章列表数据
    function initArticleList() {
        // let testData = {
        //     "status": 0,
        //     "message": "获取文章列表成功！",
        //     "data": [
        //       {
        //         "Id": 1,
        //         "title": "abab",
        //         "pub_date": "2020-01-03 12:19:57.690",
        //         "state": "已发布",
        //         "cate_name": "最新"
        //       },
        //       {
        //         "Id": 2,
        //         "title": "666",
        //         "pub_date": "2020-01-03 12:20:19.817",
        //         "state": "已发布",
        //         "cate_name": "股市"
        //       }
        //     ],
        //     "total": 5
        //   }
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (response) {
                if (response.status != 0) {
                    layer.msg('获取文章列表失败！')
                    console.log(response);
                    return console.log('失败！');
                }
                console.log(response);
                // 服务器的数据库里没数据,所以看不到东西
                console.log('获取文章列表成功！');
                let htmlStr = template('tpl-table', response.data)
                $('tbody').html(htmlStr)
                // 页面渲染完成，渲染分页
                renderPage(response.total)
            }
        });
      }
    //   初始化文章分类数据
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (response) {
                if (response.status != 0) {
                    return layer.msg('获取文章分类失败！')
                }
                // 渲染
                let htmlStr = template('tpl-cate', response)
                $('[name=cate_id]').html(htmlStr)
                // 让layui重新渲染select区域
                form.render()
            }
        });
      }

    //   为筛选表单绑定submit事件
    $('#form-select').on('submit', function(e) {
        e.preventDefault()
        // 获取表单数据
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        console.log(q);
        initArticleList()
    })

    // 渲染分页
    function renderPage(total) {
       laypage.render({
        elem: 'page-box', //分页容器id
        count: total, //总数据条数
        limit: q.pagesize, //每页显示多少条
        curr: q.pagenum, //默认选中的分页
        layout: ['count' ,'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2,3,5,10],
        // 分页发生切换的时候，触发jump回调函数
        // 只要调用laypage.render()就会触发jump函数
        jump: function(obj, first) {
            // console.log(obj.curr)
            // 把最新的页码值赋给查询参数
            q.pagenum = obj.curr
            // 把最新的条目数赋给查询参数
            q.pagesize = obj.limit
            // 重新渲染列表
            // console.log(first);
            if (!first) {
                // laypage.render()就会触发jump函数，first为TRUE
                initArticleList()
            }
        }
       })
    }

    // 删除功能
    $('tbody').on('click', '#btn-del', function () {
        let id = $(this).attr('data-id')
        // 获取删除按钮个数
        let count = $('.delete').length
        // 询问用户
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (response) {
                    if (response.status != 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 数据删除完成后，判断当前这一页是否还有数据
                    // 如果没有，就把页码值减1，再刷新
                    if (count == 1) {
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1
                    }
                    initArticleList()
                }
            });
            layer.close(index);
          });
    });

    // 编辑功能TODO
    // $('tbody').on('click', '#btn-edit', function () {});
})