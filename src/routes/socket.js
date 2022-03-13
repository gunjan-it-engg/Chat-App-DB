const express = require("express");
const sockets = new express.Router();
const auth = require("../middleware/auth");

sockets.post("/user/chat", auth ,async (req,res)=>{
    console.log("chat")
    var io = req.app.get('socketio');
    try{
        io.emit("new","new user has been joined")
        res.status(201).send("ok")
    } catch(e){
        res.status(401).send({error:e.message})
    }
})

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
sockets.post("/user/continoue/chat",auth, async(req,res)=>{
    var io = req.app.get("socket.io")
    try{
        io.to(req.body.data.Toid).emit("chattingMessage",req.body.data.message)
        res.status(201).send("ok")
    } catch (e){
        res.status(401).send({error:e.message})
    }
})

// creating a room with custom name
sockets.post("/create/room",auth,async(req,res)=>{
    var io = req.app.get("socket.io")
    try{
        var rooms = [];
        io.on('list-room',function(){
            io.emit('list-room',rooms)
        })
        io.on('create',function(roomname){
            rooms[room] = room
            io.room = roomname
            io.join(roomname)
        })
    } catch(e){
        res.status(401).send({error:e.message})
    }
})

module.exports = sockets