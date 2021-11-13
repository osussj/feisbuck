const User = require("../../database/models/user");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch {
    const error = new Error("Error loading users");
    next(error);
  }
};

module.exports = { getUsers };
