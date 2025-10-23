const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required',
    }),

  description: Joi.string()
    .min(5)
    .max(500)
    .optional()
    .messages({
      'string.base': 'Description must be a string',
      'string.min': 'Description must be at least 5 characters long',
      'string.max': 'Description must not exceed 500 characters',
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be a positive number',
      'number.precision': 'Price must have at most 2 decimal places',
      'any.required': 'Price is required',
    }),

  brandId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Brand ID must be a number',
      'number.integer': 'Brand ID must be an integer',
      'number.positive': 'Brand ID must be a positive number',
      'any.required': 'Brand ID is required',
    }),

  categoryIds: Joi.array()
    .items(Joi.number().integer().positive().required())
    .min(1)
    .required()
    .messages({
      'array.base': 'Category IDs must be an array',
      'array.items': 'Each category ID must be a positive integer',
      'array.min': 'At least one category ID must be provided',
      'any.required': 'Category IDs are required',
    }),

  status: Joi.string()
    .valid('active', 'inactive')
    .required()
    .messages({
      'string.base': 'Status must be a string',
      'any.only': 'Status must be either "active" or "inactive"',
      'any.required': 'Status is required',
    }),
});

module.exports = productSchema;
