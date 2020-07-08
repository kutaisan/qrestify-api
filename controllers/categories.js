const asyncHandler = require("../middlewares/async");
const Menu = require("../models/Menu");
const Category = require("../models/Category");
const ErrorResponse = require("../utils/ErrorResponse");

// @desc Get all categories of menu
// @route GET /api/v1/menus/:menuId/category
// @route GET /api/v1/category
// @access PUBLIC

exports.getCategories = asyncHandler(async (req, res, next) => {
  if (!req.params.menuId) {
    const categories = await Category.find();

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  }

  const menu = await Menu.findById(req.params.menuId);

  if (!menu) {
    return next(
      new ErrorResponse(`No menu found with id of ${req.params.menuId}`, 404)
    );
  }

  const categories = await Category.find({ menu: req.params.menuId });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

// @desc Get single category
// @route GET /api/v1/categories/:id
// @access PUBLIC

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`No category found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

// @desc Add category to database
// @route POST /api/v1/menus/:menuId/category
// @access PRIVATE

exports.addCategory = asyncHandler(async (req, res, next) => {
  // Add user
  req.body.user = req.user.id;
  req.body.menu = req.params.menuId;

  const menu = await Menu.findById(req.params.menuId);

  if (!menu) {
    return next(
      new ErrorResponse(`No menu found with id of ${req.params.menuId}`, 404)
    );
  }

  //Check authorization

  if (menu.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add category to menu ${req.params.menuId}`,
        400
      )
    );
  }
  const category = await Category.create(req.body);

  res.status(200).json({
    success: true,
    data: category,
  });
});

// @desc Update category
// @route PUT /api/v1/categories/:id
// @access PRIVATE

exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`No category found with id of ${req.params.id}`, 404)
    );
  }

  // Check if menu belongs to user

  if (req.user.id !== category.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.params.id} not authorize to update`, 404)
    );
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: category,
  });
});

// @desc Delete category
// @route DELETE /api/v1/categories/:id
// @access PRIVATE

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`No category found with id of ${req.params.id}`, 404)
    );
  }

  // Check if menu belongs to user

  if (req.user.id !== category.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.params.id} not authorize to delete`, 404)
    );
  }

  category.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
