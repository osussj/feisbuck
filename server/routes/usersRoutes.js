const express = require("express");
const { validate } = require("express-validation");
const userLoginSchema = require("../../database/requestSchemas/loginRequestSchema");

const {
  userRegisterSchema,
} = require("../../database/requestSchemas/registerRequestSchema");

const { createUser, loginUser } = require("../controller/userController");

const router = express.Router();

router.post("/register", validate(userRegisterSchema), createUser);

router.post("/login", validate(userLoginSchema), loginUser);

module.exports = router;
