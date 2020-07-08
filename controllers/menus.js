const asyncHandler = require("../middlewares/async");
const Menu = require("../models/Menu");
const Restaurant = require("../models/Restaurant");
const ErrorResponse = require("../utils/ErrorResponse");

// @desc Get all menus of restaurant
// @route GET /api/v1/restaurants/:restaurantId/menus
// @route GET /api/v1/menus
// @access PUBLIC

exports.getMenus = asyncHandler(async (req, res, next) => {
  if (!req.params.restaurantId) {
    const menus = await Menu.find();

    return res.status(200).json({
      success: true,
      count: menus.length,
      data: menus,
    });
  }

  const restaurant = await Restaurant.findById(req.params.restaurantId);

  if (!restaurant) {
    return next(
      new ErrorResponse(
        `No restaurant found with id of ${req.params.restaurantId}`,
        404
      )
    );
  }

  const menus = await Menu.find({ restaurant: req.params.restaurantId });

  res.status(200).json({
    success: true,
    count: menus.length,
    data: menus,
  });
});

// @desc Get single menu
// @route GET /api/v1/menus/:id
// @access PUBLIC

exports.getMenu = asyncHandler(async (req, res, next) => {
  const menu = await Menu.findById(req.params.id);

  if (!menu) {
    return next(
      new ErrorResponse(`No menu found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: menu,
  });
});

// @desc Add menu to database
// @route POST /api/v1/restaurants/:restaurantId/menus
// @access PRIVATE

exports.addMenu = asyncHandler(async (req, res, next) => {
  // Add user
  req.body.user = req.user.id;
  req.body.restaurant = req.params.restaurantId;

  const restaurant = await Restaurant.findById(req.params.restaurantId);

  if (!restaurant) {
    return next(
      new ErrorResponse(
        `No restaurant found with id of ${req.params.restaurantId}`,
        404
      )
    );
  }

  //Check authorization

  if (restaurant.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add menu to restaurant ${req.params.restaurantId}`,
        400
      )
    );
  }
  const menu = await Menu.create(req.body);

  res.status(200).json({
    success: true,
    data: menu,
  });
});

// @desc Update menu
// @route PUT /api/v1/menus/:id
// @access PRIVATE

exports.updateMenu = asyncHandler(async (req, res, next) => {
  let menu = await Menu.findById(req.params.id);

  if (!menu) {
    return next(
      new ErrorResponse(`No menu found with id of ${req.params.id}`, 404)
    );
  }

  // Check if menu belongs to user

  if (req.user.id !== menu.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.params.id} not authorize to update`, 404)
    );
  }

  menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: menu,
  });
});

// @desc Delete menu
// @route DELETE /api/v1/menus/:id
// @access PRIVATE

exports.deleteMenu = asyncHandler(async (req, res, next) => {
  const menu = await Menu.findById(req.params.id);

  if (!menu) {
    return next(
      new ErrorResponse(`No menu found with id of ${req.params.id}`, 404)
    );
  }

  // Check if menu belongs to user

  if (req.user.id !== menu.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.params.id} not authorize to delete`, 404)
    );
  }

  menu.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
