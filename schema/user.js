const joi = require('joi')


/*** string() 值必须是字符串 
 * * alphanum() 值只能是包含 a-zA-Z0-9 的字符串 
 * * min(length) 最小长度 
 * * max(length) 最大长度 
 * * required() 值是必填项，不能为 undefined 
 * * pattern(正则表达式) 值必须符合正则表达式的规则 */

// 用户名的校验规则
const username = joi.string().alphanum().min(3).max(10).required()

// 密码的校验规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

// 注册和登录表单的校验规则对象
exports.reg_login_schema = {
    body: {
        username,
        password
    }
}

// id的校验规则
const id = joi.number().integer().min(1).required()

// 昵称的校验规则
const nickname = joi.string().min(2).required()

// 邮箱的校验规则
const email = joi.string().email().required()

// 更新用户信息校验规则对象，注意如果表单传过来的值名字和校验规则不一致，要用：语法
exports.update_userinfo_schema = {
    body: {
        id,
        nickname,
        email
    }
}