const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [32, "Name cannot be more than 32 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [300, "Description cannot be more than 300 characters"],
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number cannot be more than 20 characters"],
    },
    location: {
      type: String,
    },
    logo: {
      type: String,
      default: "no-photo.jpg",
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
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
// Cascade delete menus when restaurant deleted
RestaurantSchema.pre("remove", async function (next) {
  await this.model("Menu").deleteMany({ restaurant: this._id });
  next();
});

// Reverse populate virtuals

RestaurantSchema.virtual("menus", {
  ref: "Menu",
  localField: "_id",
  foreignField: "restaurant",
  justOne: false,
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
