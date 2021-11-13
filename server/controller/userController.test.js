const bcrypt = require("bcrypt");
const User = require("../../database/models/user");
const { createUser } = require("./userController");

jest.mock("../../database/models/user");

describe("Given a createUser function", () => {
  describe("When it receives a request with the credentials of the user", () => {
    test("Then it should invoke the method json with the corresponding credentials", async () => {
      const user = {
        name: "manolo",
        username: "manolo",
        password: await bcrypt.hash("hola123", 10),
        admin: false,
      };
      const req = {
        body: user,
      };
      const res = {
        json: jest.fn().mockResolvedValue(user),
      };

      User.create = jest.fn().mockResolvedValue(user);
      await createUser(req, res);

      expect(res.json).toHaveBeenCalledWith(user);
    });
  });
  describe("When it receives a request with bad credentials of the user", () => {
    test("Then it should invoke the next function", async () => {
      const user = {};
      const error = {
        error: "Bad credentials provided",
        code: 400,
      };
      const req = {
        body: user,
      };
      const next = jest.fn();
      User.create = jest.fn().mockRejectedValue(user);

      await createUser(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(error).toHaveProperty("error", "Bad credentials provided");
      expect(error.code).toBe(400);
    });
  });
});
