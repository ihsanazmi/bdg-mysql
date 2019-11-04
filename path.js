const path = require('path')

// Method dari package 'path' yang berfungsi untuk menggabungkan alamat
console.log(__dirname)
// console.log(__filename)

let uploadDirectory = path.join(__dirname, '/public/uploads')

console.log(Date.now())