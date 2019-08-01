
const express = require('express')
const path = require('path')
const port = process.env.PORT || 80
const app = express();

app.use(express.static(__dirname))

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
     //res.send('Hello World');
})

app.listen(port)