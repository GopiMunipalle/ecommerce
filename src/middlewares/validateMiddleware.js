const { sendError } = require('../utils/response');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return sendError(res, 400, error.details.map((detail) => detail.message));
    }

    next();
  };
};

module.exports = validate;
