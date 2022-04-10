// 导入数据库操作模块
const db = require('../db/index')

// 导入加密模块
const bcrypt = require('bcryptjs')

// 导入生成token的模块
const jwt = require('jsonwebtoken')

const config = require('../config')

// 定义了两个路由处理函数

// 注册用户的处理函数
exports.regUser = (req, res) => {
    var userinfo = req.body

    console.log('i have been validated and userinfo is' + userinfo.username + '|' + userinfo.password);

    // // 如果为空，返回注册失败，已被数据验证中间件取代
    // if (!userinfo.username || !userinfo.password)
    // // return res.send({
    // //     status: 1,
    // //     message: '用户注册失败！'
    // // })
    //     return res.cc('用户注册失败')

    // 检查用户名是否被占用 
    var sqlstr = 'select * from ev_users where username=?'

    db.query(sqlstr, userinfo.username, (err, results) => {

        // 判断是否存在数据库异常
        if (err)
        // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        if (results.length > 0)
        // return res.send({ status: 1, message: '用户名已被占用，请修改！' })
            return res.cc('用户名已被占用，请更换！')

        // 调用hashSync方法进行加盐加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        console.log(userinfo);

        // 插入数据库
        const sql = 'insert into ev_users set ?'

        // 注意简明语句的写法，直接用对象
        db.query(sql, userinfo, (err, results) => {
            // 执行sql语句失败
            if (err)
            // return res.send({ status: 1, message: err.message })
                return res.cc(err)

            // 执行sql语句成功，但是影响行数不为1
            if (results.affectedRows !== 1)
            // return res.send({ status: 1, message: '用户注册失败' })
                return res.cc('用户注册失败')

            // res.send({ status: 0, message: '用户注册成功' })
            return res.cc('用户注册成功!', 0)
        })
    })

}

// 登录的处理函数
exports.login = (req, res) => {
    var userinfo = req.body
        // 根据用户名查询用户的数据
    var sqlstr = 'select * from ev_users where username=?'

    db.query(sqlstr, userinfo.username, (err, results) => {
        // 执行sql语句异常
        if (err)
            return res.cc(err)
        if (results.length !== 1)
            return res.cc('该用户不存在')

        // 如果查得，结果集中的密码和用户密码进行比较，使用bcrypt.compareSync方法
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult)
            return res.cc('登录失败！')

        // 如果比对成功，返回登录成功的状态信息和token字符串
        var user = {...results[0], password: '', user_pic: '' }
            // console.log(user);

        // 调用sign方法，对用户的信息进行加密，生成token
        var tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
            // console.log(tokenStr);

        // 响应给客户端
        res.send({
            status: 0,
            message: '登录成功！',
            token: 'Bearer ' + tokenStr
        })

    })

}