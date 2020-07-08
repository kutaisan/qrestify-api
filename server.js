const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const colors = require("colors");
const errorHandler = require("./middlewares/error");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const connectDB = require("./config/db");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Router imports

const users = require("./routes/users");
const auth = require("./routes/auth");
const restaurants = require("./routes/restaurants");
const menus = require("./routes/menus");
const categories = require("./routes/categories");
const products = require("./routes/products");

// Connect to database
connectDB();

const app = express();

//Body parser
app.use(express.json());

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Cookie Parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Security headers
app.use(helmet());

// XSS Filter
app.use(xss());

// HPP
app.use(hpp());

// Cors
app.use(cors());

// Mount routes

app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);
app.use("/api/v1/restaurants", restaurants);
app.use("/api/v1/menus", menus);
app.use("/api/v1/category", categories);
app.use("/api/v1/products", products);

// Error handling

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow
      .bold
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
});
