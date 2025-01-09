import express from "express";
import Flower from "../models/flowers.js";

const router = express.Router();

router.route("/flowers").get(async function (req, res) {
  // find data
  const allFlowers = await Flower.find().exec();

  res.send(allFlowers);
});

router.route("/flowers/:seasonid").get(async function (req, res) {
  // find data matching seasonid
  const flowerId = await Flower.findById(req.params.seasonid);

  res.send(flowerId);
});

router.route("/flower-by-season/:season").get(async function (req, res) {
  // find data matching seasonid
  const flowerSeason = await Flower.find({
    season: { $regex: new RegExp(`^${req.params.season}$`, "i") },
  });

  // Handle case where no flowers are found
  if (flowerSeason.length === 0) {
    return res
      .status(404)
      .json({ error: "No flowers found for the specified season." });
  }
  res.send(flowerSeason);
});

router.route("/flowers").post(async function (req, res) {
  // create document in database
  const newFlower = await Flower.create(req.body);

  // send back flower with appropriate status code
  res.status(201).send(newFlower);
});

router.route("/flowers/:id").delete(async function (req, res) {
  // find data matching id
  const id = req.params.id;
  const deleteFlower = await Flower.findByIdAndDelete(id).exec();

  res.send(deleteFlower);
});

router.route("/flowers/:name").put(async function (req, res) {
  const flowerName = req.params.name;
  const updatedData = req.body;

  const updatedFlower = await Flower.findOneAndUpdate(
    { name: flowerName },
    { $set: updatedData },
    { new: true, runValidators: true }
  );

  res.send(updatedFlower);
});

export default router;
