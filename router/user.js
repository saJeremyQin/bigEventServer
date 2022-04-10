// 导入express
const express = require('express')

// 导入路由处理函数模块
const routerHandler = require('../router_handler/user')

// 创建router
const router = express.Router()

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')

// 导入需要验证的规则对象
const { reg_login_schema } = require('../schema/user')


// 注册新用户
// 在注册新用户的路由中，使用一个局部中间件，验证表单数据，如通过验证，流转给handler，如不通过，抛出一个全局错误
router.post('/reguser', expressJoi(reg_login_schema), routerHandler.regUser)

// 用户登录
router.post('/login', expressJoi(reg_login_schema), routerHandler.login)

// 给外部使用
module.exports = router