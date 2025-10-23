const Joi = require('joi');

const addressValidation = Joi.object({
    addressId: Joi.number().optional(),
    line1: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    postalCode: Joi.string().optional(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
});

module.exports = addressValidation;
