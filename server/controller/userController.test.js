const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");
const { createUser, loginUser } = require("./userController");

jest.mock("../../database/models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

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

describe("Given a loginUser function", () => {
  describe("When it receives a incorrect username", () => {
    test("Then it should invoke a next function with error(code 401)", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      const req = {
        body: {
          username: "addmin",
          password: "admmin",
        },
      };
      const next = jest.fn();
      const expectedError = new Error("Wrong credentials");
      expectedError.code = 401;

      await loginUser(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
    });
  });

  describe("When it receives a correct username and incorrect password", () => {
    test("Then it should invoke a next function with error(code 401)", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        username: "addmin",
        password: "admmin",
        id: "23",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      const next = jest.fn();
      const req = {
        body: {
          username: "addmin",
          password: "admmin",
        },
      };
      const expectedError = new Error("Wrong credentials");
      expectedError.code = 401;

      await loginUser(req, null, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedError.message
      );
      expect(next.mock.calls[0][0]).toHaveProperty("code", expectedError.code);
    });
  });

  describe("When it receives a correct username and a correct password", () => {
    test("Then it should invoke res.json with an object with a brand new token inside", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        username: "admin",
        password: "admin",
        id: "23",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      const expectedToken = "someExpectedToken";
      jwt.sign = jest.fn().mockReturnValue(expectedToken);
      const res = {
        json: jest.fn(),
      };
      const req = {
        body: {
          username: "admin",
          password: "admin",
        },
      };
      const expectedResponse = {
        token: expectedToken,
      };

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
