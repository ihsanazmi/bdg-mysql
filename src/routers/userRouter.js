const conn = require('../connection/index')
const router = require('express').Router()
const valid = require('validator')
const bcryptjs = require('bcryptjs')
const sendVerification = require('../emails/nodemailer')
const multer = require('multer')
const path = require('path')
const uploadDirectory = path.join(__dirname, '/../../public/uploads')
const fs = require('fs')

// menentukan dimana foto akan disimpan dan bagaimana foto tersebut diberi nama
const _storage = multer.diskStorage({
    // menentukan folder penyimpanan foto
    destination: function(req, file, cb){
        cb(null, uploadDirectory)
    },
    // menentukan pola nama file
    filename: function(req, file, cb){
        cb(null, 'avatar-' + req.params.username + path.extname(file.originalname))
    }
})

const upload = multer({
    storage : _storage,
    limits:{
        fileSize: 1000000 // byte, max 1MB
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Format file harus jpg/jpeg/png'))
        }
        cb(null, true)
    }
})

// POST AVATAR
router.post('/avatar/:username', (req, res, next)=>{
    const sql = `SELECT * FROM users WHERE username = '${req.params.username}'`

    conn.query(sql, (err, result)=>{
        if(err) return res.send({error: err.message})
        let user = result[0]
        if(!user) return res.send({error: "User Not Found"})
        req.user = user
        next()
    })
},upload.single('avatar') ,(req, res)=>{
    const sql = `UPDATE users SET avatar = '${req.file.filename}' WHERE username = '${req.params.username}' `
    
    conn.query(sql, (err, result)=>{
        if(err) return res.send(err)
        res.send({filename: req.file.filename})
    })

}, (err, req, res, next)=>{
    if(err) return res.send({error: err.message})
})

// ACCESS IMAGE
router.get('/avatar/:imageName', (req, res)=>{
    let letakFolder = {
        root: uploadDirectory,
    }

    let namaFile = req.params.imageName

    res.sendFile(namaFile, letakFolder, function(err){
        if(err) return res.send({error: err.message})
    })

})

// DELETE AVATAR
router.patch('/avatar/delete/:username', (req,res)=>{
    const sql = `SELECT * FROM users WHERE username = '${req.params.username}'`
    const sql2 = `UPDATE users SET avatar = null WHERE username = '${req.params.username}'`

    conn.query(sql, (err, result)=>{
        if(err) return res.send({error: err.message})
        let avatar = result[0].avatar
        fs.unlink(uploadDirectory + '/' + avatar, (err)=>{
            if(err) return res.send({error: err.message})
            
            conn.query(sql2, (err, result) =>{
                if(err) return res.send({error: err.message})
                res.send(result)
            })
        })

    })
})

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

        sendVerification(data)
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

    data[0].password = bcryptjs.hashSync(data[0].password, 8)

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
        if(user.verify === 0){
            return res.send({error: "Please Verification your email"})
        }

        res.send(user)
    })
})

router.get('/verification/:username', (req, res)=>{
    let sql = `UPDATE users SET verify = true WHERE username = '${req.params.username}'`

    conn.query(sql, (err, result)=>{
        if(err) return res.send(err)

        res.send('<p>Verifikasi email berhasil, silahkan login di halaman login')
    })
})

// READ PROFILE
router.get('/users/profile/:username', (req, res)=>{
    let sql = `SELECT * FROM users WHERE username = '${req.params.username}'`

    conn.query(sql, (err, result)=>{
        if(err) return res.send({error: err.message})

        let user = result[0]

        if(!user) return res.send({error: "User not Found"})

        res.send({
            ...user,
            avatar: `http:/localhost:2019/avatar/${user.avatar}`
        })
    })
})

module.exports = router