const express = require("express");
const { getUsers } = require("../controller/userActionsController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, getUsers);

module.exports = router;
