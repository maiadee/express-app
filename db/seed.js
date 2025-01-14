// responsible for adding data to our db for developmental purposes
import mongoose from "mongoose";
import Flower from "../models/flowers.js";
import flowers from "../data.js";
import User from "../models/user.js";

async function seed() {
  // seed our database with data from our file
  console.log(`hello seed 🌱`);
  // connect to mongoose
  const url = "mongodb://127.0.0.1:27017/";
  const dbname = "flowers-db";
  await mongoose.connect(`${url}${dbname}`);

  // clear database
  await mongoose.connection.db.dropDatabase();

  // ! We mnow need to make asure all flowers have  a user field set
  // * seed a user first, then use that user for our destinations
  const user = await User.create({
    username: "maia",
    email: "maia@maia.com",
    password: "Maia1234!",
  });

  // * add the user to our flowers
  flowers.forEach((flower) => {
    flower.user = user;
  });

  // add data to db
  const newFlowers = await Flower.create(flowers);
  console.log(newFlowers);

  // disconnect
  await mongoose.disconnect();
}

seed();
