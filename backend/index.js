const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: true,
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  socket.on("call:end", ({ to }) => {
    io.to(to).emit("call:ended", { from: socket.id });
  });

  socket.on("chat:message", ({ to, message }) => {
    const senderEmail = socketidToEmailMap.get(socket.id);
    io.to(to).emit("chat:message", { 
      from: socket.id, 
      senderEmail,
      message,
      timestamp: new Date().toISOString()
    });
    // Send back to sender as well
    socket.emit("chat:message", {
      from: socket.id,
      senderEmail,
      message,
      timestamp: new Date().toISOString(),
      isSelf: true
    });
  });
});
