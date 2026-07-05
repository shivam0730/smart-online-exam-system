const Joi = require("joi");

const email = Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
        "string.empty": "Email is required.",
        "string.email": "Please enter a valid email address.",
        "any.required": "Email is required.",
    });

    
const password = Joi.string()
    .trim()
    .min(8)
    .max(32)
    .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,32}$/
    )
    .required()
    .messages({
        "string.empty": "Password is required.",
        "string.min": "Password must be at least 8 characters long.",
        "string.max": "Password cannot exceed 32 characters.",
        "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        "any.required": "Password is required.",
    });

module.exports = {
    email,
    password,
};
