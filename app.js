// 导入express
const express = require('express')

// 导入router模块
const userRouter = require('./router/user')
const userInfoRouter = require('./router/userInfo')
const artCatRouter = require('./router/artcate')

// 导入joi模块
const joi = require('joi')

// 创建一个app实例
const app = express()

// 导入cors，解决跨域问题
const cors = require('cors')

// 将cors设置为全局中间件
app.use(cors())

// 配置解析析 application/x-www-form-urlencoded 格式表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 一定要在路由之前，注册一个全局中间件，为res挂载一个res.cc方法
app.use(function(req, res, next) {
    // 默认status为1
    res.cc = function(err, status = 1) {

            res.send({
                // 好像可以简写，why
                status,
                // 判断是否为err对象，如果是赋值为err.message,否则是字符串
                message: err instanceof Error ? err.message : err
            })
        }
        // 一定要调用next，交给下一步处理
    next()
})

// 一定要在路由之前，配置解析token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

// 使用解析token的中间件
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 配置注册路由模块
app.use('/api/', userRouter)

// 配置用户信息路由模块
app.use('/my/', userInfoRouter)

// 配置文章分类路由模块,挂载统一的访问前缀
app.use('/my/article/', artCatRouter)

// 定义全局的错误处理
app.use(function(err, req, res, next) {
    //console.log(err);

    // 数据验证处理失败的错误
    if (err instanceof joi.ValidationError)
        return res.cc(err)


    // 身份认证失败导致的错误
    if (err.name === 'UnauthorizedError')
        return res.cc('身份认证失败')
    return res.cc('未知的错误！')
})

// 启动并监听请求
app.listen(3007, function() {
    console.log('api server is running at http: //127.0.0.1:3007')
})