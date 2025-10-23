const DefaultErrors = {
  internalError: "Something went wrong",
  notFound: "Resource not found",
  validationError: "Invalid request data",
  unauthorized: "Unauthorized access",
};

function sendSuccess(res, data = {}, status = 200) {
  return res.status(status).json({
    status,
    success: true,
    data,
  });
}

function sendError(res, status = 500, error = { error: DefaultErrors.internalError }) {
  if (Array.isArray(error)) {
    return res.status(status).json({
      status,
      success: false,
      errors: error,
    });
  } else {
    return res.status(status).json({
      status,
      success: false,
      error,
    });
  }
}

module.exports = {
  sendSuccess,
  sendError,
  DefaultErrors,
};
