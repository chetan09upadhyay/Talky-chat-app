const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/usersRoute");
const messagesRoutes = require("./routes/messagesRoute");
const socket = require("socket.io");
const app = express();
require("dotenv").config();
const path = require('path');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



app.use("/api/auth",usersRoutes);
app.use("/api/messages",messagesRoutes);




mongoose.connect(process.env.MONGO_URL ,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(() =>{
    console.log("DB is run successfully");
})
.catch((err) =>{
    console.log(err.message);
}); 


// static files.
app.use(express.static(path.join(__dirname, '../pub/build')));

app.get('*', function(req,res){
  res.sendFile(path.join(__dirname, "../pub/build/index.html"));
});


const server = app.listen(port, () =>{
    console.log(`Server Started on post ${process.env.PORT}`);
});
 
 
   


const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });