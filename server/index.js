// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const usersRoutes = require("./routes/usersRoute");
// const messagesRoutes = require("./routes/messagesRoute");

// const app = express();
// require("dotenv").config();

// app.use(cors());
// app.use(express.json());

// // Middleware to handle async errors
// const asyncMiddleware = (fn) => (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
// };

// app.use("/api/auth", asyncMiddleware(usersRoutes)); // Apply async middleware here
// app.use("/api/message", asyncMiddleware(messagesRoutes)); // Apply async middleware here

// mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => {
//     console.log("DB is run successfully");
// })
// .catch((err) => {
//     console.log(err.message);
// });

// const server = app.listen(process.env.PORT, () => {
//     console.log(`Server Started on port ${process.env.PORT}`);
// });










const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/usersRoute");
const messagesRoutes = require("./routes/messagesRoute");
const socket = require("socket.io");
const app = express();
require("dotenv").config();

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



const server = app.listen(process.env.PORT, () =>{
    console.log(`Server Started on post ${process.env.PORT}`);
});

// const io = socket(server,{
//   cors: {
//     origin: "https://localhost:3000",
//     credentials: true,

//   },
// });

// global.onlineUsers = new Mpa();

// io.on("connection", (socket) => {
//     global.chatSocket = socket;
//     socket.on("add-user", (userId) => {
//         onlineUsers.set(userId, socket.id);
//     });

//     socket.on("send-msg", (data) => {
//         const sendUserSocket = onlineUsers.get(data.to);
//         if(sendUserSocket){
//             socket.to(sendUserSocket).emit("msg-recieve", data.msg);
//         }
//     });
// });
 
   


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