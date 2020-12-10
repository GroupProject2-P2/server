const cors = require('cors')
const express = require('express')
const app = express()
const PORT = 3000
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const question = require('./question.json')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))



io.on('connection', (socket) => {
  console.log('a user connected')

  socket.emit("welcomeMessage", "Hello, welcome to guess is correct or wrong! Please fill the username first") 
  
  
})

http.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});