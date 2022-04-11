// 导入express
const express = require('express')



// 导入路由处理函数模块
const routerHandler = require('../router_handler/userInfo')

// 创建路由实例，注意是大写
const router = express.Router()

// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')

// 导入验证用户信息表单和重置密码的规则对象
const { update_userinfo_schema, update_password_schema } = require('../schema/user.js')


// 配置获取用户信息的路由
router.get('/userinfo', routerHandler.getUserInfo)

// 配置更新用户信息的路由
router.post('/userinfo', expressJoi(update_userinfo_schema), routerHandler.updateUserInfo)

// 配置更新用户密码的路由
router.post('/updatepwd', expressJoi(update_password_schema), routerHandler.updatePassword)

// 对外共享这个对象
module.exports = router