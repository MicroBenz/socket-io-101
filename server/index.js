const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();

const httpServer = http.createServer(app);

const io = socketio(httpServer);

const messages = [{ message: 'Smoke Weed Everyday', created_at: new Date(), name: 'Smoker' }];

io.on('connection', (socket) => {
  socket.emit('everyMessages', messages);

  socket.on('newMessage', (message) => {
    messages.push({ message: message.text, name: message.name, created_at: new Date() });
    socket.emit('everyMessages', messages);
  });
});

httpServer.listen(3001, () => {
  console.log('SocketIO server is listening at 3001');
});
