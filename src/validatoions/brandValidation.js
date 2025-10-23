const Joi = require("joi");

const brandSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Brand name is required",
    "any.required": "Brand name is required",
    "string.min": "Brand name must be at least 2 characters long",
  }),
  createdBy: Joi.number().optional(),
});

module.exports = { brandSchema };
