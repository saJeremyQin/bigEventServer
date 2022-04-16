// 导入express模块
const express = require('express')

// 导入事件处理函数模块
const routerHandler = require('../router_handler/article')

// 导入数据验证的中间件
const expressJoi = require('@escook/express-joi')

// 导入需要验证的规则对象
const { add_article_schema, get_articleList_schema, delete_article_schema, get_article_schema } = require('../schema/article')

// 导入multer模块
const multer = require('multer')

// 导入处理路径的path模块
const path = require('path')

// 创建multer实例，指定文件存放路径
const uploads = multer({ dest: path.join(__dirname, '../uploads') })



// 创建路由实例
const router = express.Router()

// 挂载发布新文章的事件处理函数
// upload.single是一个局部中间件，用来解析form表单中的formdata数据
// 将文件类型的数据存储到指定目录中，并把文件的信息挂载到req.file
// 将文本类型的数据获取，并挂载到req.body
// 这里用了两个中间件，次序调用
router.post('/add', uploads.single('cover_img'), expressJoi(add_article_schema), routerHandler.addArticle)

// 挂载获取文章列表的时间处理函数
router.get('/list', expressJoi(get_articleList_schema), routerHandler.getArticleList)

// 挂载根据id删除文章数据的处理函数
router.get('/delete/:id', expressJoi(delete_article_schema), routerHandler.deleteArticleById)

// 挂载根据id获取文章数据的处理函数
router.get('/:id', expressJoi(get_article_schema), routerHandler.getArticleById)
module.exports = router