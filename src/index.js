const express = require('express')

const userRouter = require('./routers/userRouter')

const app = express()
const port = 2019

app.use(express.json())
app.use(userRouter)

app.listen(port, ()=>{
    console.log(`running at port ${port}`)
})