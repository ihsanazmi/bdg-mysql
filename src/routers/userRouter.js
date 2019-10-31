const conn = require('../connection/index')
const router = require('express').Router()
const valid = require('validator')
const bcryptjs = require('bcryptjs')

// CREATE USER
// router.post('/users', (req, res)=>{
//     let {username, name, email, password} = req.body

//     let sql = `INSERT INTO users(username, name, email, password) VALUES('${username}', '${name}', '${email}', '${password}')`

//     conn.query(sql, (err, result)=>{
//         // Jika terdapat error
//         if(err) return res.send(err)
//         res.send(result)
//     })
// })

// GET ALL USER
router.get('/users', (req, res)=>{
    let sql = `SELECT * FROM users`

    conn.query(sql, (err, result)=>{
        if(err) return res.send(err)

        res.send(result)
    })
})

// CREATE USER V2
router.post('/users', (req, res)=>{
    let sql = `INSERT INTO users SET ?` // tanda tanya akan diisi oleh data
    let sql2 = `SELECT * FROM users`
    let data = req.body // {username, name, email, password}
    // Cek format email
    if(!valid.isEmail(data.email)) return res.send({error: "Format email salah"})
    // encrypt password 
    data.password = bcryptjs.hashSync(data.password, 8)

    conn.query(sql, data, (err, result)=>{
        if(err) return res.send(err)

        conn.query(sql2, (err, result)=>{
            if(err) return res.send(err)
            res.send(result)
        })
    })
})

// UPDATE USER
router.patch('/users/update/:userid', (req, res)=>{
    let sql = `UPDATE users SET ? WHERE id = ?`
    let data = [req.body, req.params.userid]

    conn.query(sql, data, (err, result)=>{
        if(err) return res.send(err)
        res.send(result)
    })
})

// DELETE USER
router.delete('/users/delete/:userid', (req, res)=>{
    let sql = `DELETE FROM users WHERE id = ${req.params.userid}`

    conn.query(sql, (err, result)=>{
        if(err) return res.send(err)
        res.send(result)
    })
})

// LOGIN EMAIL DAN PASSWORD
router.post('/users/login', (req, res)=>{
    let {email, password} = req.body
    let sql = `SELECT * FROM users WHERE email = '${email}'`

    conn.query(sql, async (err, result)=>{
        if(err) return res.send(err)
        
        if(result.length === 0 ) return res.send({error: "User not Found"})

        let user = result[0]
        let hasil = await bcryptjs.compare(password, user.password)
        if(!hasil){
            return res.send({error: "Password Salah"})
        }

        res.send(user)
    })
})

module.exports = router