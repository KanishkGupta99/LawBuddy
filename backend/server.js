const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

// Store user email to socket ID mappings
const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user:register', ({ email }) => {
    console.log(`User registered: ${email}`);
    users.set(email, socket.id);
  });

  socket.on('user:call', ({ to, from, offer }) => {
    console.log(`Call from ${from} to ${to}`);
    const targetSocketId = users.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('incoming:call', { from, offer });
    }
  });

  socket.on('call:accepted', ({ to, ans }) => {
    console.log(`Call accepted by ${to}`);
    const targetSocketId = users.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('call:accepted', { ans });
    }
  });

  socket.on('call:rejected', ({ to }) => {
    console.log(`Call rejected for ${to}`);
    const targetSocketId = users.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('call:rejected');
    }
  });

  socket.on('ice:candidate', ({ to, candidate }) => {
    const targetSocketId = users.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('ice:candidate', { candidate });
    }
  });

  socket.on('disconnect', () => {
    // Remove user from users map
    users.forEach((socketId, email) => {
      if (socketId === socket.id) {
        users.delete(email);
      }
    });
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
