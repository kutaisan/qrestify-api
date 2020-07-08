const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");

// Protect routes

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Token exists

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  // Verify token

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decodedToken);

    req.user = await User.findById(decodedToken.id);

    next();
  } catch (error) {
    next(new ErrorResponse("Not authorized to access this route", 401));
  }
});
