import express from "express";
// You can import your own files into each other.
import flowers from "./data.js";
// Import Mongoose
import mongoose from "mongoose";
// import my flowers model
import Flower from "./models/flowers.js";

import flowerController from "./controllers/flowerController.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import methodOverride from 'method-override'


const app = express();

// ! 🚨 We need this line of code for posting JSON to express
app.use(express.json());
// 
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))

// new logging middleware
app.use(logger);

// have app use the new desitnation controller
app.use("/", flowerController);

// final piece of middleware
app.use(errorHandler);

// Listen for requests on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});

// * Connect to our database using mongoose.
const url = "mongodb://127.0.0.1:27017/";
const dbname = "flowers-db";
mongoose.connect(`${url}${dbname}`);
