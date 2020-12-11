const cors = require('cors')
const express = require('express')
const { join } = require('path')
const app = express()
const PORT = 3000
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const listQuestion = require('./question.json')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))


let joinUsers = []
let question

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.emit("welcomeMessage", "Please Fill In Your Username") 

  socket.on('login', (payload) => {
    joinUsers.push({
      username: payload,
      status: 'Ready',
      score: 0,
      benar: 0,
      salah: 0
    })
    io.emit('login', joinUsers)
  })
  
  socket.on('startTheGame', () => {
    console.log('masuk appjs')
    io.emit('startGame')
  })

  socket.on('questions', (payload) => {
    const rand = Math.floor(Math.random()*listQuestion.length)
    for (let i = 0; i < listQuestion.length; i++) {
      question = listQuestion[rand] 
    }
    // console.log(question)
    io.emit('questions', question);
  })

  socket.on('jawabanSalah', (username) => {
    for (let i = 0; i < joinUsers.length; i++) {
      if (joinUsers[i].username === username) {
        joinUsers[i].score -= 3
        joinUsers[i].salah++
        break
      }
    }
    io.emit('login', joinUsers)
  })

  socket.on('jawabanBenar', (username) => {
    for (let i = 0; i < joinUsers.length; i++) {
      if (joinUsers[i].username === username) {
        joinUsers[i].score += 10
        joinUsers[i].benar++
        if (joinUsers[i].score >= 100) {
          io.emit('moveToResult', joinUsers[i].username)
          joinUsers = []
        }
        break
      }
    }
    io.emit('login', joinUsers)
  })
})

http.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});