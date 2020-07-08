const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
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
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
    required: true,
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

// Cascade delete categories when menu deleted
MenuSchema.pre("remove", async function (next) {
  await this.model("Category").deleteMany({ menu: this._id });
  next();
});

module.exports = mongoose.model("Menu", MenuSchema);
