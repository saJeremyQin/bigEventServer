// 导入数据验证模块
const joi = require('joi')

/*** string() 值必须是字符串 
 * * alphanum() 值只能是包含 a-zA-Z0-9 的字符串 
 * * min(length) 最小长度 
 * * max(length) 最大长度 
 * * required() 值是必填项，不能为 undefined 
 * * pattern(正则表达式) 值必须符合正则表达式的规则 */

// 定义标题、分类Id、内容、发布状态的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow(' ')
const state = joi.string().valid('已发布', '草稿').required()

// 定义获取文章列表的页码值,单页数量,文章分类id和发布状态
const pagenum = joi.number().integer().min(1).required()
const pagesize = joi.number().integer().min(1).max(50).required()

// cate_id可以为空
//const l_cate_id = joi.number().integer().min(1).optional()
const l_cate_id = joi.string().allow('').optional()

// 状态可以为空，或者已发布，草稿，为空时默认为草稿
//const l_state = joi.string().valid('已发布', '草稿').empty('').default('')

// 状态可以为空，有时候可能需要所有状态的都列上
const l_state = joi.string().valid('已发布', '草稿', '').optional()

// 定义根据id获取删除文章数据的id规则
const id = joi.number().integer().min(1).required()

// 发布新文章的校验规则对象
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state
    }
}

// 获取文章列表的校验规则对象
exports.get_articleList_schema = {
    query: {
        pagenum,
        pagesize,
        cate_id: l_cate_id,
        state: l_state
    }
}

// 根据id删除文章数据的校验规则对象
exports.delete_article_schema = {
    params: {
        id
    }
}

// 根据id获取文章数据的校验规则对象
exports.get_article_schema = {
    params: {
        id
    }
}