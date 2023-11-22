// Express.js Server
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

const cors = require('cors');
app.use(cors());


// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('send_message', (data) => {
    console.log('Message from React:', data);
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



// 監聽到關閉事件，執行指定的處理程序
process.on('SIGINT', () => {
  console.log('Server is shutting down...');
  // 關閉伺服器的監聽
  process.exit(1); // 強制結束進程
});

