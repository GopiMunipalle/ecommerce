const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Category name is required",
    "any.required": "Category name is required",
    "string.min": "Category name must be at least 2 characters long",
  }),
  createdBy: Joi.number().optional(),
});

module.exports = { categorySchema };
