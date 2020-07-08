const express = require("express");

const { protect } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

const {
  getProducts,
  getProduct,
  updateProduct,
  addProduct,
  deleteProduct,
} = require("../controllers/products");

router.route("/").get(getProducts).post(protect, addProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
