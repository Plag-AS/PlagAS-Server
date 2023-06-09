// VALIDATION
const Joi = require("@hapi/joi");

//Regoster Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(2).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(4).required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(4).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
