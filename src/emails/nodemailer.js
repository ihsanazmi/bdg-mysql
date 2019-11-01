const nodemailer = require('nodemailer')
const config = require('./config')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'ihsanazmi.developer@gmail.com',
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken
    }
})

let sendVerification = (data)=>{
    let mail = {
        from : 'M. Ihsan Azmi <ihsanazmi.developer@gmail.com>',
        to: data.email,
        subject: 'Selamat Datang',
        html: `<h1>Hello ${data.name}</h1><br>
                <p>Silahkan klik <a href="http://localhost:2019/verification/${data.username}">disini</a> untuk verifikasi email</p>`
    }
    
    transporter.sendMail(mail, (err, result)=>{
        if(err) return console.log(err.message)
    
        console.log('email berhasil dikirim')
    })
}


module.exports = sendVerification