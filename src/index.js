const jwt = require("jsonwebtoken");
const express = require("express");
const auth = require("./middleware/auth")
const http = require("http");
const UserRouter = require("./routes/user");
const cors = require("cors");
const socketIo = require("socket.io");


const port = process.env.PORT || 4000;
const index = require("./routes/chat");
const sockets = require("./routes/socket");

const app = express();
app.use(express.json())
const server = http.createServer(app);

require("./db/mongoose")
app.use(index);
app.use(UserRouter)
app.use(sockets)
app.use(
    cors({
      allowedHeaders: ["sessionId", "Content-Type"],
      exposedHeaders: ["sessionId"],
      origin: "*",
      optionsSuccessStatus: 200,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
    })
  );


const io = socketIo(server);
app.set('socketio', io);

let interval;
let userslist = [];
let userdata = [];
let count= 0;

// socket authentication 
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log("cheching handshake token",token)
  if (isValidJwt(token)){
    next();
}else{
    next(new Error("Socket authentication error"));
}
})

async function isValidJwt(token){
  jwt.verify(token, "userislogin", function(err, decoded) {
    console.log("decoded code",decoded)  
    if (err){
          console.log(err);
          return false;
      }else{
          //console.log(decoded);
          return true;
      }
  });
}

// app.post("/connection",auth, async(req,res)=>{
io.on("connection", (socket) => {
  // try{
    // console.log(req.user.name , socket.id)
    // console.log(userslist.includes(req.user.name && socket.id === false ? "ddd" : "ss"))
    count++
      if(userslist.includes(socket.id) === false){
        userdata.push({"id":socket.id})
        // userdata.push({"name":req.user.name,"id":socket.id})
      }
    userslist.push(...userdata)
    // console.log(userslist)
    io.emit("recive",userslist)
    // socket.emit('onlinelist', userslist =>{
    // })
    let connectedUsersCount = io.engine.clientsCount
    // let connectedUsersCount = userslist.length()
    console.log("count",connectedUsersCount)

    let oneUserLeft = connectedUsersCount - 1;
    // let oneUSerLefts = userslist.pop(req.user.name , socket.id)
    let oneUSerLefts = userslist.pop( socket.id)
    io.emit('connectedUsersCount', connectedUsersCount);

    console.log("New client connected");
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);

    socket.on("disconnect", () => {
      count--;
      oneUserLeft,
      oneUSerLefts,
      console.log("Client disconnected");
      clearInterval(interval);
    });
    // res.status(200).send("connection established")

  // } catch (e){
  //   res.status(500).send({error:e.message})
  // }
// })
})
app.post("/user/chating", auth , async (req,res)=>{
  // var io = req.app.get('socket.io')
  try{
      console.log(req.body.data)
      await io.to(req.body.data).emit("chating",`${req.user.name} waved with you`)
      res.status(201).send("chatiing sucess")
  } catch (e){
      res.status(401).send({error:e.message})
  }
})



const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
// var express = require("express");
// const UserRouter = require("./routes/user");
// const cors = require("cors");
// const User = require("./model/user");
// const auth = require("./middleware/auth");
// const path = require("path")
// const socketio = require("socket.io");
// const http = require("http");
// const Filter = require("bad-words");
// const {
//   generateMessages,
//   generateLocationMessage,
// } = require("./utils/messages");

// var app = express();
// const server = http.createServer(app);
// // const io = socketio(server);
// // app.use(
// //   cors({
// //     allowedHeaders: ["sessionId", "Content-Type"],
// //     exposedHeaders: ["sessionId"],
// //     origin: "*",
// //     optionsSuccessStatus: 200,
// //     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// //     preflightContinue: false,
// //   })
// // );
// require("./db/mongoose");

// const publicDirectoryPath = path.join(__dirname, "../public");

// app.use(express.static(publicDirectoryPath));



// const io = socketio(server,{
//   cors:{
//     origin:"http://localhost:3000",
//     method:['GET','POST'],
//     Credential:true,
//   },
// });
// // app.io = io
// // app.set("socketio",io)
// const userslist = {}

// const NEW_CHAT_MESSAGE_EVENT = 'NEW_CHAT_MESSAGE_EVENT';

// io.on('connection',(socket)=>{
//   io.on('connection', (socket) => {
//     console.log(`${socket.id} connected`);
//     // Join a conversation
//     const { roomId } = socket.handshake.query;
//     socket.join(roomId);
//     // Listen for new messages
//     socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
//       io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
//     });
//     // Leave the room if the user closes the socket
//     socket.on('disconnect', () => {
//       socket.leave(roomId);
//     });
//   });
// //   console.log(`${socket.id} connected`)
// //   socket.broadcast.emit("message", generateMessages("==New user has joined=="));
// //   console.log("New web Socket connection");
// //   socket.emit("message", generateMessages("welcome!!"));

// //   socket.on("sendMessage", (message, callback) => {
// //     const filter = new Filter();

// //     if (filter.isProfane(message)) {
// //       return callback("profanity is not allowed");
// //     }
// //     io.emit("message", generateMessages(message));
// //     callback();
// //   });
// //   socket.on("disconnect", () => {
// //     io.emit("message", generateMessages("==A new user has left=="));
// //   });

// //   socket.on("sendLocation", (coords, callback) => {
// //     io.emit(
// //       "location",
// //       generateLocationMessage(
// //         `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
// //       )
// //     );
// //     callback();
// //   });
//   // join a conversation 
//   // const {roomId} = socket.handshake.query
//   // socket.join(roomId)
//   //  // Listen for new messages
//   //  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
//   //   io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
//   // });
//   // // Leave the room if the user closes the socket
//   // socket.on('disconnect', () => {
//   //   socket.leave(roomId);
//   // });
  
// })

// // app.get("/chat", auth, async(req,res)=>{
// //   try{
// //     if(req.user._id){
// //       io.on("connection",  (socket) => {
// //         console.log("connected to socket")
// //         userslist[socket.id] = req.body.email,
// //               socket.broadcast.emit("message","New user has joined");
// //               console.log("work")
// //               socket.on('onlinelist', userslist =>{
// //                 socket.broadcast.emit("recive",{name: userslist[socket.id]})
// //               }),
// //         // const token = socket.handshake.query.token;
// //         // if (auth(token)){
// //            socket.on('list', userslist =>{
// //               socket.broadcast.emit("recive",{name: userslist[socket.id]})
// //            }),
// //            socket.on("sendMessage", (message, callback) => {
// //             io.emit("message", message);
// //             callback();
// //           }),
// //           socket.on('create',function(room){
// //             socket.join(room)
// //             io.socket.in(room).emit("connected to room",room)
// //           }),
// //           // for chat user
// //           socket.on('chat', async function(message,socket){
// //           const userId = await fetchUserId(socket)
// //           socket.join(userId);
// //           //and then Later
// //           io.to(userId).emit(message)
      
// //           //leave room 
// //           socket.on("leave",async function(socket){
// //             const userId = await fetchUserId(socket)
// //             socket.leave(userId)
// //             socket.emit("leave",userId)
// //           })
// //           })
// //         // }
// //       })
// //       res.status(200).send("sucess")
// //     }
// //   } catch (e){
// //     res.status(400).send(e.message)
// //   }
// // })
// // io.on("connection",  (socket) => {
// //   const token = socket.handshake.query.token;
// //   if (auth(token)){
// //      socket.on('list', userslist =>{
// //         socket.broadcast.emit("recive",{name: userslist[socket.id]})
// //      })
// //      socket.on("sendMessage", (message, callback) => {
// //       io.emit("message", message);
// //       callback();
// //     });
// //     socket.on('create',function(room){
// //       socket.join(room)
// //       io.socket.in(room).emit("connected to room",room)
// //     });
// //     // for chat user
// //     socket.on('chat', async function(message,socket){
// //     const userId = await fetchUserId(socket)
// //     socket.join(userId);
// //     //and then Later
// //     io.to(userId).emit(message)

// //     //leave room 
// //     socket.on("leave",async function(socket){
// //       const userId = await fetchUserId(socket)
// //       socket.leave(userId)
// //       socket.emit("leave",userId)
// //     })
// //     })
// //   }
// // });


// app.use(express.json());

// // user route
// app.use(UserRouter);



// app.post("/users/login", async (req, res) => {
//     try {
//       const user = await User.findByCredentials(
//         req.body.data.email,
//         req.body.data.password,
//       );
//       // await User.findOneAndUpdate(
//       //   { email: req.body.data.email },
//       //   { isloggedin: true },
//       //   { new: true }
//       // );
//       // if ( user ){
//       //     console.log("connection")
//       //     io.on("connect", (socket) => {
//       //         userslist[socket.id] = req.body.email,
//       //         socket.broadcast.emit("message","New user has joined");
//       //         console.log("work")
//       //         socket.on('onlinelist', userslist =>{
//       //           socket.broadcast.emit("recive",{name: userslist[socket.id]})
//       //        })
//       //     });
//       // }
//       const token = await user.generateAuthToken();
//       res.status(201).send({ user, token });
//     } catch (e) {
//       res.status(400).send({ error: e.message });
//     }
//   });


// // app.get("/", function (req, res) {
// //   res.send("Hello World!");
// // });
// app.listen(4000, function () {
//   console.log("app server listening on port 4000!");
// });
// // app.use(express.static(path.join(__dirname,'../my-app')));
// //     app.get("/*", (req,res) => {
// //         res.sendFile(path.resolve(__dirname,"my-app","build","index.html"));
// //     });