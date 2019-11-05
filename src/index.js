const express = require('express')

const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')

const app = express()
const port = process.env.PORT || 2019
// const port = 2019

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('/', (req, res) => {
    res.send(`<h1>Running at ${port}</h1>`)
})

app.listen(port, ()=>{
    console.log(`running at port ${port}`)
})