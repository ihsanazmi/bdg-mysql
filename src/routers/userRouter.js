const conn = require('../connection/index')
const router = require('express').Router()

// CREATE USER
router.post('/users', (req, res)=>{
    let {username, name, email, password} = req.body

    let sql = `INSERT INTO users(username, name, email, password) VALUES('${username}', '${name}', '${email}', '${password}')`

    conn.query(sql, (err, result)=>{
        // Jika terdapat error
        if(err) return res.send(err)
        res.send(result)
    })
})