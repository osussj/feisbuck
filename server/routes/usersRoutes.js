const express = require("express");
const { validate } = require("express-validation");

const {
  userRegisterSchema,
} = require("../../database/requestSchemas/registerRequestSchema");

const { createUser } = require("../controller/userController");

const router = express.Router();

router.post("/register", validate(userRegisterSchema), createUser);

module.exports = router;
