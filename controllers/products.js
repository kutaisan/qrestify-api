const asyncHandler = require("../middlewares/async");
const Product = require("../models/Product");
const Category = require("../models/Category");
const ErrorResponse = require("../utils/ErrorResponse");

// @desc Get all products of category
// @route GET /api/v1/category/:categoryId/products
// @route GET /api/v1/products
// @access PUBLIC

exports.getProducts = asyncHandler(async (req, res, next) => {
  if (!req.params.categoryId) {
    const products = await Product.find();

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  }

  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    return next(
      new ErrorResponse(
        `No category found with id of ${req.params.categoryId}`,
        404
      )
    );
  }

  const products = await Product.find({ category: req.params.categoryId });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

// @desc Get single product
// @route GET /api/v1/products/:id
// @access PUBLIC

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`No product found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc Add product to database
// @route POST /api/v1/category/:categoryId/products
// @access PRIVATE

exports.addProduct = asyncHandler(async (req, res, next) => {
  // Add user
  req.body.user = req.user.id;
  req.body.category = req.params.categoryId;

  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    return next(
      new ErrorResponse(
        `No category found with id of ${req.params.categoryId}`,
        404
      )
    );
  }

  //Check authorization

  if (category.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add product to category ${req.params.menuId}`,
        400
      )
    );
  }
  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc Update product
// @route PUT /api/v1/products/:id
// @access PRIVATE

exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`No product found with id of ${req.params.id}`, 404)
    );
  }

  // Check if menu belongs to user

  if (req.user.id !== product.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.params.id} not authorize to update`, 404)
    );
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc Delete product
// @route DELETE /api/v1/products/:id
// @access PRIVATE

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`No product found with id of ${req.params.id}`, 404)
    );
  }

  // Check if menu belongs to user

  if (req.user.id !== product.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.params.id} not authorize to delete`, 404)
    );
  }

  product.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
