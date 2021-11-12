const { Joi } = require("express-validation");

const userLoginSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
module.exports = userLoginSchema;
