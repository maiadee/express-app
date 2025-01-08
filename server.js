import express from "express";
// You can import your own files into each other.
import flowers from "./data.js";
// Import Mongoose
import mongoose from "mongoose";
// import my flowers model
import Flower from "./models/flowers.js";

const app = express();

// ! 🚨 We need this line of code for posting JSON to express
app.use(express.json());

// Listen for requests on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.get("/flowers/:seasonid", async function (req, res) {
  // find data matching seasonid
  const flowerId = await Flower.findById(req.params.seasonid);

  res.send(flowerId);
});


app.get("/flower-by-season/:season", async function (req, res) {
  // find data matching seasonid
  const flowerSeason = await Flower.find({
    season: { $regex: new RegExp(`^${req.params.season}$`, "i") },
  });
  console.log(flowerSeason);
  // Handle case where no flowers are found
  if (flowerSeason.length === 0) {
    return res
      .status(404)
      .json({ error: "No flowers found for the specified season." });
  }
  res.send(flowerSeason);
});

app.get("/flowers", async function (req, res) {
  // find data
  const allFlowers = await Flower.find().exec();

  res.send(allFlowers);
});

app.post("/flowers", async function (req, res) {
  // create document in database
  const newFlower = await Flower.create(req.body);

  // send back flower with appropriate status code
  res.status(201).send(newFlower);
});

app.delete("/flowers/:id", async function (req, res) {
  // find data matching id
  const id = req.params.id;
  const deleteFlower = await Flower.findByIdAndDelete(id).exec();
  console.log(deleteFlower);
  res.send(deleteFlower);
});

app.put("/flowers/:name", async function (req, res) {
  const flowerName = req.params.name;
  const updatedData = req.body;

  const updatedFlower = await Flower.findOneAndUpdate(
    { name: flowerName },
    { $set: updatedData },
    { new: true, runValidators: true }
  );

  res.send(updatedFlower);
});
// * Connect to our database using mongoose.
const url = "mongodb://127.0.0.1:27017/";
const dbname = "flowers-db";
mongoose.connect(`${url}${dbname}`);
