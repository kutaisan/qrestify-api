// @desc Get all users
// @route GET /api/v1/users
// @access PUBLIC

exports.getUsers = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Get all users",
  });
};

// @desc Get specific user
// @route GET /api/v1/user/:id
// @access PUBLIC

exports.getUser = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Get specific users",
  });
};

// @desc Add user
// @route POST /api/v1/user
// @access PUBLIC

exports.addUser = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Add user",
  });
};

// @desc Update user
// @route PUT /api/v1/user/:id
// @access PRIVATE

exports.updateUser = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Update user",
  });
};

// @desc Add user
// @route POST /api/v1/user/:id
// @access PUBLIC

exports.deleteUser = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Delete user",
  });
};
