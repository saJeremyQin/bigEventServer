// 导入数据库操作模块
const db = require('../db/index')

// 导入处理路径的path模块
const path = require('path')





// 发布文章的事件处理函数
exports.addArticle = (req, res) => {
    //   以下为req.file的信息
    //   fieldname: 'cover_img',               **没有实际含义，与接口保持一致即可
    //   originalname: '33.jpg',               **原始文件名
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   destination: 'F:\\learning\\api_server\\uploads',      **保存路径    
    //   filename: 'c97b1019ae5905abff838e5cc6996337',          **随机生成的文件名
    //   path: 'F:\\learning\\api_server\\uploads\\c97b1019ae5905abff838e5cc6996337',
    //   size: 3024
    console.log(req.file);



    if (!req.file || req.file.fieldname !== 'cover_img')
        return res.cc('文章封面是必选参数！')

    // TODO: 如果数据格式合法，下一步操作数据库
    var sqlstr = 'insert into ev_articles set ?'

    // var article = {}
    // article.title = req.body.title
    // article.content = req.body.content
    // article.cover_img = path.join(req.file.destination, req.file.fieldname)
    // article.pub_date = new Date()
    // article.state = req.body.state
    // article.cate_id = req.body.cate_id
    // article.author_id = req.user.id
    var articleInfo = {
        // 展开运算符，标题、分类Id、内容、发布状态
        ...req.body,
        // 文章的存储路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章的发布日期, 格式如 2022-04-16T02:47:08.121Z
        pub_date: new Date(),
        // 作者id，从req.user里获取
        author_id: req.user.id
    }
    console.log(articleInfo);



    //调用数据库操作
    db.query(sqlstr, articleInfo, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows !== 1)
            return res.cc('发布新文章失败')
                // 如果添加文章正常
        res.cc('发布文章成功', 0)

    })
}

// 获取文章列表的处理函数
exports.getArticleList = (req, res) => {
    //处理需要查询的文章id


    console.log(req.query);

    var cate_id = req.query.cate_id || null
    var state = req.query.state || null
    var pagenum = req.query.pagenum
    var pagesize = req.query.pagesize

    // if (typeof(req.query.cate_id) === 'undefined')
    //     cate_id = NULL

    // console.log(cate_id);

    // console.log('----')
    // console.log(req.query.pp || null);
    // console.log('kkkkk');
    var tmpResults = []


    //定义操作数据库的sql语句，用到了join语法，从ev_article中查4个值，从ev_article_cate中查1个值
    //这里用到的是内连接，两张表中都有的文章分类id，才会出现在结果集中

    var  sqlstr  =  'select a.id as Id, a.title, a.pub_date, a.state, b.name as cate_name from ev_articles as a,ev_article_cate as b where a.cate_id = b.id and a.cate_id = ifnull(?, a.cate_id)  and a.state = ifnull(?, a.state) and a.is_delete = 0  limit ?,?'
        //const sql = 'select a.id, a.title, a.pub_date, a.state, b.name as cate_name from ev_articles as a,ev_article_cate as b where a.cate_id = b.id and (a.cate_id = CASE WHEN ? IS NULL THEN a.cate_id ELSE ? END)  and a.is_delete = 0  limit ?,?'
        //db.query(sqlstr, (err, results) => {
    db.query(sqlstr, [cate_id, state, (pagenum - 1) * pagesize, pagesize], (err, results) => {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message); // 方便调试用
            return res.cc(err)
        }

        if (results.length === 0)
            return res.cc('获取文章列表失败1')

        tempResults = results

        // 查询总计多少条，计算total的方法，应当与上边的cate_id和state条件保持一致
        var countsql = 'select * from ev_articles where cate_id=ifnull(?, cate_id) and state=ifnull(?, state) and is_delete=0'
        db.query(countsql, [cate_id, state], (err, results) => {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                //return res.cc(err)
                return res.cc('获取文章列表失败2')
            }
            res.send({
                status: 0,
                message: '获取文章列表成功！',
                data: tempResults,
                total: results.length
            })

        })
    })


    // // 获取总条数
    // let total = null;
    // const countsql = 'select * from ev_articles where is_delete = 0'
    // db.query(countsql, (err, total) => {
    //     if (err)
    //         return res.cc(err)
    // })
    // console.log(total);



}

// 根据id删除文章数据的处理函数
exports.deleteArticleById = (req, res) => {
    // 这里用标记删除
    var sqlstr = 'update ev_articles set is_delete=1 where id=?'

    // 调用db.query执行sql语句
    db.query(sqlstr, req.params.id, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows !== 1)
            return res.cc('删除文章数据失败')
        res.cc('删除文章数据成功！', 0)
    })
}

// 根据id获取文章详情的处理函数
exports.getArticleById = (req, res) => {
    // 定义获取文章分类的sql语句
    var sqlstr = 'select * from ev_articles where id=?'

    // 执行sql查询
    db.query(sqlstr, req.params.id, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.length !== 1)
            return res.cc('获取文章失败')
        res.send({
            status: 0,
            message: '获取文章数据成功',
            data: results
        })
    })
}