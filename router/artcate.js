// 导入express模块
const express = require('express')

// 导入路由处理函数模块
const routerHandler = require('../router_handler/artcate')

// 导入数据验证的中间件
const expressJoi = require('@escook/express-joi')

// 导入校验规则模块
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcat')

// 创建路由实例
const router = express.Router()

// 挂载获取文章分类的路由函数
router.get('/cates', routerHandler.getArticleCates)

// 挂载新增文章分类的路由函数
router.post('/addcates', expressJoi(add_cate_schema), routerHandler.addArticleCates)

// 挂载根据id删除文章分类的路由函数，这种叫restful风格url，获取id用req.params
router.get('/deletecate/:id', expressJoi(delete_cate_schema), routerHandler.deleteCateById)

// 挂载根据id获取文章分类的路由函数
router.get('/cates/:id', expressJoi(get_cate_schema), routerHandler.getCateById)

// 挂载根据id更新文章分类的路由函数
router.post('/updatecate', expressJoi(update_cate_schema), routerHandler.updateCateById)

module.exports = router