// Express.js Server
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

const cors = require('cors');
app.use(cors());


// Allow all origins in your CORS configuration to handle requests from your deployed frontend.
const io = new Server(server, {
  cors: {
    origin: '*',
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


// Let the Express server know to serve the React project
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
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

