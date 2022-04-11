// 导入数据库连接对象
const db = require('../db/index')



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