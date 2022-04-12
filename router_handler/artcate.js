// 导入数据库操作模块
const db = require('../db/index')

// 获取文章分类的处理函数
exports.getArticleCates = (req, res) => {

    // 定义sql语句
    var sqlstr = 'select * from ev_article_cate where is_delete=0 order by id asc'

    db.query(sqlstr, (err, results) => {
        // sql语句执行失败
        if (err)
            return res.cc(err)
        if (results.length === 0)
            return res.cc('获取文章分类失败')

        res.send({
            status: 0,
            message: '获取文章分类列表成功',
            data: results
        })
    })
}

// 添加文章分类的处理函数
exports.addArticleCates = (req, res) => {
    // 查询分类名称和别名是否被占用
    var sqlstr = 'select * from ev_article_cate where name=? or alias=?'

    db.query(sqlstr, [req.body.name, req.body.alias], (err, results) => {
        // 如果sql语句执行失败
        if (err)
            return res.cc(err)

        console.log(results);

        // 名称和别名已被占用
        if (results.length === 2)
            return res.cc('该文章分类名称和别名均被占用,请修改')

        // 名称和别名被占用，且为同一条数据
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias)
            return res.cc('该文章分类名称和别名均被占用,请修改')

        if (results.length === 1 && results[0].name === req.body.name)
            return res.cc('该文章分类名称被占用,请修改')

        if (results.length === 1 && results[0].alias === req.body.alias)
            return res.cc('该文章分类别名被占用,请修改')

        // 名称和别名可以使用
        var sqlstr = 'insert into ev_article_cate set ?'
        db.query(sqlstr, req.body, (err, results) => {
            // 如果sql语句执行失败
            if (err)
                return res.cc(err)

            if (results.affectedRows !== 1)
                return res.cc('添加文章分类失败')
            res.cc('添加文章分类成功！', 0)
        })

    })

}

// 根据id删除文章分类的处理函数
exports.deleteCateById = (req, res) => {

    // 定义标记删除文章分类的sql语句
    //var sqlstr = 'delete from ev_article_cate where id=?'
    var sqlstr = 'update ev_article_cate set is_delete=1 where id=?'

    // 调用db.query执行sql语句
    db.query(sqlstr, req.params.id, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.affectedRows !== 1)
            return res.cc('删除文章分类失败')
        res.cc('删除文章分类成功！', 0)
    })



}

// 根据id获取文章分类的处理函数
exports.getCateById = (req, res) => {
    // 定义获取文章分类的sql语句
    var sqlstr = 'select * from ev_article_cate where id=?'

    // 执行sql查询
    db.query(sqlstr, req.params.id, (err, results) => {
        if (err)
            return res.cc(err)
        if (results.length !== 1)
            return res.cc('获取文章分类失败')
        res.send({
            status: 0,
            message: '获取文章分类成功',
            data: results
        })
    })
}

// 更新文章分类的处理函数
exports.updateCateById = (req, res) => {

    // 查询分类名称和别名是否被占用,and后边要用括号（这样查询的时候才能均把id排除在外）
    var sqlstr = 'select * from ev_article_cate where id<>? and (name=? or alias=?)'
        // 判断文章分类名称和别名是否被占用
    db.query(sqlstr, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        // 如果sql语句执行失败
        if (err)
            return res.cc(err)

        // 名称和别名已被占用的几种情况
        if (results.length === 2)
            return res.cc('该文章分类名称和别名均被占用,请修改')

        // 名称和别名被占用，且为同一条数据
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias)
            return res.cc('该文章分类名称和别名均被占用,请修改')

        if (results.length === 1 && results[0].name === req.body.name)
            return res.cc('该文章分类名称被占用,请修改')

        if (results.length === 1 && results[0].alias === req.body.alias)
            return res.cc('该文章分类别名被占用,请修改')

        // 名称和和别名可以使用，定义更新文章分类的sql语句
        var sqlstr = 'update ev_article_cate set name=?,alias=? where Id=?'

        db.query(sqlstr, [req.body.name, req.body.alias, req.body.Id], (err, results) => {
            if (err)
                return res.cc(err)
            if (results.affectedRows !== 1)
                return res.cc('更新文章分类失败！')

            //如果更新文章分类成功
            res.cc('更新文章分类成功', 0)
        })

    })
}