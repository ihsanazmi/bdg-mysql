const mysql = require('mysql')

const conn = mysql.createConnection({
    // user: 'devuser',
    user: 'kumisdev',
    password: 'Ihsanazmi26',
    host: 'db4free.net',
    database: 'bdg_mysql_kumis',
    port: 3306
})

module.exports = conn
