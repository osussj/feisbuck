const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");

const createUser = async (req, res, next) => {
  const { name, username, password, age, image } = req.body;
  try {
    const user = await User.create({
      name,
      username,
      password: await bcrypt.hash(password, 10),
      age,
      image,
    });
    res.json(user);
  } catch {
    const error = new Error("Bad credentials provided");
    error.code = 400;
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    const error = new Error("Wrong credentials");
    error.code = 401;
    next(error);
  } else {
    const rightPassword = await bcrypt.compare(password, user.password);
    if (!rightPassword) {
      const error = new Error("Wrong credentials");
      error.code = 401;
      next(error);
    } else {
      const token = jwt.sign(
        {
          username: user.username,
          id: user.id,
          friends: user.friends,
          enemies: user.enemies,
        },
        process.env.SECRET_HASH
      );
      res.json({ token });
    }
  }
};

const updateUser = async (req, res, next) => {
  const { id } = req.userInfo;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (user) {
      res.json(user);
    } else {
      const error = new Error("User not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, loginUser, updateUser };
