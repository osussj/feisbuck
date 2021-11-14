const User = require("../../database/models/user");
const { getUsers, addFriend } = require("./userActionsController");

jest.mock("../../database/models/user");
describe("Given getUsers", () => {
  describe("When User.find resolves without error", () => {
    test("Then it should call json with the users", async () => {
      const users = [
        {
          name: "guest",
        },
        {
          name: "admin",
        },
      ];
      const res = {
        json: jest.fn(),
      };
      User.find = jest.fn().mockResolvedValue(users);

      await getUsers(null, res);

      expect(res.json).toHaveBeenCalledWith(users);
    });
  });
  describe("When User.find resolves with error", () => {
    test("Then it should call json with the users", async () => {
      const next = jest.fn();
      const error = new Error("Error loading users");
      const errorCode = 500;
      User.find = jest.fn().mockRejectedValue();

      await getUsers(null, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", errorCode);
    });
  });
});

test("...", async () => {
  const user = {
    name: "guest",
    username: "guest",
    password: "guest",
    id: "443",
    save: jest.fn(),
  };
  const userInfo = {
    user,
  };
  const id = "333";
  const req = {
    userInfo,
    body: { id },
  };
  const result = {
    added: "1234",
  };
  const res = {
    json: jest.fn().mockResolvedValue(user),
  };
  User.findById = jest.fn().mockResolvedValue(user.id);
  User.findOne = jest.fn().mockResolvedValue(user.username);

  await addFriend(req, res);

  expect(res.json).toHaveBeenCalledWith(result);
});
