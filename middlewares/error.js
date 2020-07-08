const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
  console.log("Error: ", err);
  let error = { ...err };

  error.message = err.message;

  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }
  //Mongoose duplicate key error handling
  if (err.code === 11000) {
    const message = `Duplicate value entered`;
    error = new ErrorResponse(message, 400);
  }
  //Mongoose validation error handling
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error!",
  });
};

module.exports = errorHandler;
