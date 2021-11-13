const express = require("express");
const { validate } = require("express-validation");
const userLoginSchema = require("../../database/requestSchemas/loginRequestSchema");
const auth = require("../middlewares/auth");
const {
  userRegisterSchema,
} = require("../../database/requestSchemas/registerRequestSchema");

const {
  createUser,
  loginUser,
  updateUser,
} = require("../controller/userController");

const router = express.Router();

router.post("/register", validate(userRegisterSchema), createUser);

router.post("/login", validate(userLoginSchema), loginUser);

// router.put("/profile", auth, validate(userRegisterSchema), updateUser);
router.put("/profile/update", auth, updateUser);

module.exports = router;
