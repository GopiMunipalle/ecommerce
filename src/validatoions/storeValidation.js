const Joi = require('joi');

const addressSchema = Joi.object({
  line1: Joi.string().max(255).required(),
  city: Joi.string().max(255).required(),
  state: Joi.string().max(255).required(),
  country: Joi.string().max(255).required(),
  postalCode: Joi.string().max(20).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
});

const storeSchema = Joi.object({
  name: Joi.string().max(255).required(),
  contact: Joi.string().max(255).required(),
  address: addressSchema.optional(),
});

module.exports = storeSchema 