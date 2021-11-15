const User = require("../../database/models/user");

const getUsers = async (req, res, next) => {
  console.log(req.userInfo);
  const { id } = req.userInfo;
  try {
    const users = await User.find({ _id: { $ne: id } });
    res.json(users);
  } catch {
    const error = new Error("Error loading users");
    error.code = 500;
    next(error);
  }
};

const addFriend = async (req, res, next) => {
  const { id } = req.body;
  try {
    const friend = await User.findById(id);
    const user = await User.findOne({ username: req.userInfo.username });
    user.friends = [...user.friends, friend.id];
    await user.save(user);
    res.json({ added: friend.id });
  } catch {
    const error = new Error("Friend not found");
    error.code = 401;
    next(error);
  }
};
const getFriend = async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.userInfo.username,
    }).populate({
      path: "friends",
      select: "-password -id -friends -enemies -age",
    });
    res.json(user);
  } catch {
    const error = new Error("Error loading friends");
    error.code = 500;
    next(error);
  }
};

module.exports = { getUsers, addFriend, getFriend };
