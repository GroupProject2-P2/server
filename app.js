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
let first = false
let winner = []
let gameOver = false

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.emit("welcomeMessage", "Please Fill In Your Username") 

  socket.on('login', (payload) => {
    joinUsers.push({
      username: payload,
      status: 'Ready',
      score: 0
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
        break
      }
    }
    io.emit('login', joinUsers)
  })

  socket.on('jawabanBenar', (username) => {
    for (let i = 0; i < joinUsers.length; i++) {
      if (joinUsers[i].username === username) {
        joinUsers[i].score += 10
        if (joinUsers[i].score >= 100) {
          io.emit('moveToResult', joinUsers[i].username)
        }
        break
      }
    }
    io.emit('login', joinUsers)
  })

  

  // socket.on('result', (payload) => {  //answers
  //   let correct = question.answer
  //   for (let i = 0; i < payload.length; i++) {
  //     if (payload[i].answer === correct && first === false) {
  //       for (let j = 0; j < joinUsers.length; j++) {
  //         if (payload[i].username === joinUsers[j].username) {
  //           joinUsers[j].score += 8
  //           first = true
  //           if (joinUsers[j].score >= 50) gameOver = true
  //           break
  //         }
  //       }
  //     } else if (payload[i].answer === correct && first === true) {
  //       for (let k = 0; k < joinUsers.length; k++) {
  //         if (payload[i].username === joinUsers[k].username) {
  //           joinUsers[k].score += 5
  //           if (joinUsers[k].score >= 50) gameOver = true
  //           break
  //         }
  //       }
  //     } else {
  //       for (let l = 0; l < joinUsers.length; l++) {
  //         if (payload[i].username === joinUsers[l].username) {
  //           joinUsers[l].score -= 3
  //           break
  //         }
  //       }
  //     }
  //   }
  //   if (gameOver) {
  //     function compare(b, a) {
  //       const userA = a.score
  //       const userB = b.score
      
  //       let comparison = 0;
  //       if (userA > userB) {
  //         comparison = 1;
  //       } else if (userA < userB) {
  //         comparison = -1;
  //       }
  //       return comparison;
  //     }
      
  //     joinUsers.sort(compare)
  //     winner.push(joinUsers[0])
  //     io.emit('gameResult', winner)
  //     joinUsers = []
  //     winner = []
  //     gameOver = false
  //   }
  //   first = false
  //   io.emit('result', joinUsers)
  // })

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