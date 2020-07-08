const express = require("express");

const { protect } = require("../middlewares/auth");
const categoryRouter = require("./categories");

const router = express.Router({ mergeParams: true });

router.use("/:menuId/category", categoryRouter);

const {
  getMenus,
  getMenu,
  updateMenu,
  addMenu,
  deleteMenu,
} = require("../controllers/menus");

router.route("/").get(getMenus).post(protect, addMenu);

router
  .route("/:id")
  .get(getMenu)
  .put(protect, updateMenu)
  .delete(protect, deleteMenu);

module.exports = router;
