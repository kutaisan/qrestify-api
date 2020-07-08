const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
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
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: true,
  },
  photo: {
    type: String,
    default: "no-photo-product.jpg",
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
  },
  servingTime: {
    type: Number,
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

module.exports = mongoose.model("Product", ProductSchema);
