const cors = require('cors')
const express = require('express')
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
let first = false

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.emit("welcomeMessage", "Hello, welcome to guess is correct or wrong! Please fill the username first") 

  socket.on('login', (payload) => {
    joinUsers.push({
      username: payload,
      score: 0
    })
    io.emit('login', joinUsers)
  })
  
  socket.on('questions', (payload) => {
    const rand = Math.round(Math.random()*listQuestion.length)
    for (let i = 0; i < listQuestion.length; i++) {
      question = listQuestion[rand] 
    }
    // console.log(question)
    io.emit('questions', question);
  })

  socket.on('result', (payload) => {  //answers
    let correct = question.answer
    for (let i = 0; i < payload.length; i++) {
      if (payload[i].answer === correct && first === false) {
        for (let j = 0; j < joinUsers.length; j++) {
          if (payload[i].username === joinUsers[j].username) {
            joinUsers[j].score += 8
            first = true
            break
          }
        }
      } else if (payload[i].answer === correct && first === true) {
        for (let k = 0; k < joinUsers.length; k++) {
          if (payload[i].username === joinUsers[k].username) {
            joinUsers[k].score += 5
            break
          }
        }
      } else {
        for (let l = 0; l < joinUsers.length; l++) {
          if (payload[i].username === joinUsers[l].username) {
            joinUsers[l].score -= 3
            break
          }
        }
      }
    }
    first = false
    io.emit('result', joinUsers)
  })

  // buat bikin room
  // io.sockets.on('connection', function(socket) {
  //   socket.on('create', function(room) {
  //     socket.join(room);
  //   });
  // });
})

http.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});