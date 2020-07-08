const asyncHandler = require("../middlewares/async");
const Restaurant = require("../models/Restaurant");
const ErrorResponse = require("../utils/ErrorResponse");

// @desc Get all restaurants
// @route GET /api/v1/restaurants
// @access PUBLIC

exports.getRestaurants = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get single restaurants
// @route GET /api/v1/restaurants/:id
// @access PUBLIC

exports.getRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return next(
      new ErrorResponse(`No restaurant found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: restaurant,
  });
});

// @desc Add restaurant to database
// @route POST /api/v1/restaurants
// @access PRIVATE

exports.addRestaurant = asyncHandler(async (req, res, next) => {
  // Add user
  console.log(req.user);
  req.body.user = req.user.id;

  //Check role
  const addedRestaurant = await Restaurant.findOne({ user: req.user.id });

  if (addedRestaurant && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} already published a restaurant`,
        400
      )
    );
  }
  const restaurant = await Restaurant.create(req.body);

  res.status(200).json({
    success: true,
    data: restaurant,
  });
});

// @desc Update restaurant
// @route PUT /api/v1/restaurants/:id
// @access PRIVATE

exports.updateRestaurant = asyncHandler(async (req, res, next) => {
  let restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return next(
      new ErrorResponse(`No restaurant found with id of ${req.params.id}`, 404)
    );
  }

  // Check if restaurant belongs to user

  if (req.user.id !== restaurant.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.params.id} not authorize to update`, 404)
    );
  }

  restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: restaurant,
  });
});

// @desc Delete restaurant
// @route DELETE /api/v1/restaurants/:id
// @access PRIVATE

exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return next(
      new ErrorResponse(`No restaurant found with id of ${req.params.id}`, 404)
    );
  }

  // Check if restaurant belongs to user

  if (req.user.id !== restaurant.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.params.id} not authorize to delete`, 404)
    );
  }

  restaurant.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
