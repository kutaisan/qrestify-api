const asyncHandler = require("../middlewares/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");

// @desc Register User
// @route GET /api/v1/auth/register
// @access PUBLIC

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  // Create User

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Create Token
  sendTokenResponse(user, 200, res);
});

// @desc Login User
// @route POST /api/v1/auth/login
// @access PUBLIC

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate e-mail & password

  if (!email || !password) {
    return next(
      new ErrorResponse(`Please provide an e-mail and password`, 400)
    );
  }

  // Check user

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  // Check password match

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  // Create Token
  sendTokenResponse(user, 200, res);
});

// Get token from Model, return cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 3600 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

// @desc Get logged-in User
// @route POST /api/v1/auth/me
// @access PRIVATE

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Logout user & clear cookies
// @route POST /api/v1/auth/logout
// @access PRIVATE

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});
