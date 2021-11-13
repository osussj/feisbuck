const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    const error = new Error("Authorization error");
    error.code = 401;
    next(error);
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      const error = new Error("Token is incorrect");
      error.code = 401;
      next(error);
    } else {
      try {
        const { id, username, name, friends, enemies } = jwt.verify(
          token,
          process.env.SECRET_HASH
        );
        req.userInfo = { id, username, name, friends, enemies };
        next();
      } catch {
        const error = new Error("Verify error");
        error.code = 401;
        next(error);
      }
    }
  }
};

module.exports = auth;
