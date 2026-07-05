const Joi = require("joi");
const { email, password } = require("../../validations/common.validation");

const registerSchema = Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),

    lastName: Joi.string().trim().min(2).max(50).required(),

    email,

    password,
});

const loginSchema = Joi.object({
    email,

    password,
});

module.exports = {
    registerSchema,
    loginSchema,
};