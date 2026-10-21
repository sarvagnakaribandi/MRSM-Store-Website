/**
 * Centralized Error Handling Middleware
 */
module.exports = (err, req, res, next) => {
  console.error(`[Server Error] ${err.message}`, err.stack);

  let statusCode = err.statusCode || 500;
  let errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred on the server.';

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    errorCode = 'INVALID_IDENTIFIER';
    message = `Resource not found with invalid identifier format: ${err.value}`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    const messages = Object.values(err.errors).map((val) => val.message);
    message = messages.join('. ');
  }

  // Mongoose Duplicate Key Error (11000)
  if (err.code === 11000) {
    statusCode = 409;
    errorCode = 'DUPLICATE_RECORD';
    message = 'A record with that unique field value already exists.';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message
    }
  });
};
