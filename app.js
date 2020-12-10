const cors = require('cors')
const express = require('express')
const app = express()
const PORT = 3000
const http = require('http').createServer(app)
const io = require('socket.io')(http);

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

io.on('connection', (socket) => {
  console.log('a user connected')
})

http.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});