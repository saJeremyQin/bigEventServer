// 导入数据库连接对象
const db = require('../db/index')

// 导入加密模块
const bcrypt = require('bcryptjs')



// 获取用户信息的处理函数
exports.getUserInfo = (req, res) => {
    // 因为express-jwt的使用，已经可以从req.user获取对应的user信息
    var user = req.user

    // 根据用户id去获取用户的信息,建议用id查
    const sqlstr = 'select id, username, nickname, email, user_pic from ev_users where id=?'

    db.query(sqlstr, user.id, (err, results) => {
        // 如执行sql语句失败
        if (err)
            return res.cc(err)

        // 如果查询到的结果集条数不为1
        if (results.length !== 1)
            return res.cc('获取用户失败！')

        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取用户信息成功！',
            data: results[0]
        })
    })

}

// 修改用户信息的处理函数
exports.updateUserInfo = (req, res) => {
    // 注意，这里用req.body,因为req.user里寸的信息是老的值
    var user = req.body

    // 定义sql语句
    var sqlstr = 'update ev_users set nickname=?,email=? where id=?'
    console.log(user);


    db.query(sqlstr, [user.nickname, user.email, user.id], (err, results) => {

        // 如执行sql语句失败
        if (err)
            return res.cc(err)

        // 如果查询到的结果集条数不为1
        if (results.affectedRows !== 1)
            return res.cc('更新用户信息失败！')

        // 更新成功后的处理
        res.cc('更新用户信息成功', 0)
    })
}

// 修改用户密码的处理函数
exports.updatePassword = (req, res) => {
    // 查询提交的旧密码是否一致，内容在req.body里
    console.log(req.body);
    console.log(req.user);


    var sqlstr = 'select password from ev_users where id=?'
    db.query(sqlstr, [req.user.id], (err, results) => {

        // 如执行sql语句失败
        if (err)
            return res.cc(err)

        // 如果查询到的结果集条数不为1
        if (results.length !== 1)
            return res.cc('更新用户密码失败！')

        // 旧密码和数据库中密码比较，是否一致
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult)
            return res.cc('旧密码输入错误')

        // 旧密码验证正确，更新密码
        // 定义更新密码的sql语句
        var sqlstr = 'update ev_users set password=? where id=?'

        // 调用hashSync方法对新密码进行加盐加密
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        db.query(sqlstr, [newPwd, req.user.id], (err, results) => {
            // 如执行sql语句失败
            if (err)
                return res.cc(err)

            // 如果影响的条数不为1
            if (results.affectedRows !== 1)
                return res.cc('更新用户密码失败！')

            res.cc('更新用户密码成功', 0)

        })
    })
}