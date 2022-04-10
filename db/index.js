// 导入mysql模块
const mysql = require("mysql")

// 创建与数据库的连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '600186Qd',
    database: 'mydb01'
})

// 向外共享这个db实例
module.exports = db