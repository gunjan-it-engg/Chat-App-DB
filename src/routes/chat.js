// server.listen(port, () => console.log(`Listening on port ${port}`));
const express = require("express");
const router = new express.Router();

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

module.exports = router;