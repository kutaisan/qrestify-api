const express = require("express");

const { protect } = require("../middlewares/auth");

const productRouter = require("./products");

const router = express.Router({ mergeParams: true });

router.use("/:categoryId/products", productRouter);

const {
  getCategories,
  getCategory,
  updateCategory,
  addCategory,
  deleteCategory,
} = require("../controllers/categories");

router.route("/").get(getCategories).post(protect, addCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;
