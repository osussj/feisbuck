const { ValidationError } = require("express-validation");
const { notFoundErrorHandler, generalErrorHandler } = require("./error");

describe("Given a notFoundErrorHandler function", () => {
  describe("When an endpoint is not found ", () => {
    test("Then it should invoke the method json with a status 404 and an error message", () => {
      const errorStatus = 404;
      const errorMessage = "Endpoint not found";
      const error = {
        error: errorMessage,
      };

      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);

      notFoundErrorHandler(null, res);
      expect(res.status).toHaveBeenCalledWith(errorStatus);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a generalErrorHandler function", () => {
  describe("When it receives an error", () => {
    test("Then it should invoke the method json with the error message and the method status with 500", () => {
      const errorCode = 500;
      const errorMessage = "General pete";
      const error = {
        error: errorMessage,
      };

      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);

      generalErrorHandler(error, null, res);
      expect(res.status).toHaveBeenCalledWith(errorCode);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
  describe("When it receives an error from ValidationError", () => {
    test("THen it should invoke the method json with an error message and invoke the method status with the code", () => {
      const error = new ValidationError("Error", {
        statusCode: 500,
        error: new Error(),
      });

      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);

      generalErrorHandler(error, null, res);
      expect(res.status).toHaveBeenCalledWith(error.statusCode);
    });
  });
});
