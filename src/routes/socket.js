const express = require("express");
const sockets = new express.Router();
const Group = require("../model/rooms");
const auth = require("../middleware/auth");

sockets.post("/user/chat", auth, async (req, res) => {
  console.log("chat");
  var io = req.app.get("socketio");
  try {
    io.emit("new", "new user has been joined");
    res.status(201).send("ok");
  } catch (e) {
    res.status(401).send({ error: e.message });
  }
});

// // first select for chat
// sockets.post("/user/chating", auth , async (req,res)=>{
//     var io = req.app.get('socket.io')
//     try{
//         console.log("ss",req.body.data)
//         await io.to(req.body.data).emit("chating",`${req.user.name} waved with you`)
//         res.status(201).send("chatiing sucess")
//     } catch (e){
//         res.status(401).send({error:e.message})
//     }
// })

//continious chat
sockets.post("/user/continoue/chat/:id", auth, async (req, res) => {
  var io = req.app.get("socketio");
  try {
    const _id = req.params.id;
    console.log(req.body, _id);
    io.to(_id).emit("chattingMessage", req.body.chat);
    res.status(201).send("ok");
  } catch (e) {
    res.status(401).send({ error: e.message });
  }
});

// creating a room with custom name
sockets.post("/create/room", auth, async (req, res) => {
  var io = req.app.get("socketio");
  try {
    var rooms = [];
    io.on("list-room", function () {
      io.emit("list-room", rooms);
    });
    io.on("create", function (roomname) {
      rooms[room] = room;
      io.room = roomname;
      io.join(roomname);
    });
  } catch (e) {
    res.status(401).send({ error: e.message });
  }
});

sockets.post("/users/create/group", auth, async (req, res) => {
  try {
    var io = req.app.get("socketio");
    const group = new Group(req.body.data);
    console.log(req.body.data.name);
    await group.save();
    await io.join("Gunjan");
    await io.to(req.body).emit("new group", "new group has been created");
    res.status(200).send({ group });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

sockets.get("/users/group", auth, async (req, res) => {
  try {
    const group = await Group.find({});
    res.status(200).send({ group });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = sockets;
