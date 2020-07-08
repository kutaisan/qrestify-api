const express = require("express");
const menuRouter = require("./menus");

const { protect } = require("../middlewares/auth");

const Restaurant = require("../models/Restaurant");

const advancedResults = require("../middlewares/advancedResults");

const router = express.Router();

router.use("/:restaurantId/menus", menuRouter);

const {
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  addRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurants");

router
  .route("/")
  .get(advancedResults(Restaurant, "menus"), getRestaurants)
  .post(protect, addRestaurant);

router
  .route("/:id")
  .get(getRestaurant)
  .put(protect, updateRestaurant)
  .delete(protect, deleteRestaurant);

module.exports = router;
