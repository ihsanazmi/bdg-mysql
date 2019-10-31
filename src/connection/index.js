const mysql = require('mysql')

const conn = mysql.createConnection({
    user: 'root',
    password: 'Ihsanazmi26',
    host: 'localhost',
    database: 'bdg_mysql',
    port: 3306
})

module.exports = conn
