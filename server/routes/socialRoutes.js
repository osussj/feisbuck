const express = require("express");
const {
  getUsers,
  addFriend,
  getFriend,
} = require("../controller/userActionsController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, getUsers);

router.get("/friends", auth, getFriend);

router.post("/friends", auth, addFriend);

module.exports = router;
