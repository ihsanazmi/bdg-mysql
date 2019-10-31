const mysql = require('mysql')

const conn = mysql.createConnection({
    user: 'devuser',
    password: 'Ihsanazmi26',
    host: 'localhost',
    database: 'bdg_mysql',
    port: 3306
})

module.exports = conn
