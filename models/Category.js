const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [32, "Name cannot be more than 32 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [300, "Description cannot be more than 300 characters"],
  },
  menu: {
    type: mongoose.Schema.ObjectId,
    ref: "Menu",
    required: true,
  },
  photo: {
    type: String,
    default: "no-photo-category.jpg",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Cascade delete products when category deleted
CategorySchema.pre("remove", async function (next) {
  await this.model("Product").deleteMany({ category: this._id });
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
