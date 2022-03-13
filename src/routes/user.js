const express = require("express");
const user = new express.Router();
const User = require("../model/user");
const auth = require("../middleware/auth");
// const http = require("http");
// const socketio = require("socket.io");

// const server = http.createServer(user);
// const io = socketio(server);
// user registration

user.post("/users", async (req, res) => {
  console.log(req.body);
  try {
    const user = new User(req.body.data);
    await user.save();
    res.status(201).send({ user });
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

// user login

user.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      name = req.body.data.name,
      email = req.body.data.email,
      passoword = req.body.data.password,
    );
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// user logout
user.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    console.log(req.user.tokens);
    await req.user.save();
    res.status(200).send("You are logged out");
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
});

module.exports = user;
