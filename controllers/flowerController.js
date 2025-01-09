import express from "express";
import Flower from "../models/flowers.js";

const router = express.Router();

// * GET all flowers

router.route("/flowers").get(async function (req, res, next) {
  try {
    // find data
    const allFlowers = await Flower.find().exec();

    res.send(allFlowers);
  } catch (e) {
    next(e);
  }
});

// * GET flower by id

router.route("/flowers/:id").get(async function (req, res, next) {
  try {
    // find data matching id
    const flowerId = await Flower.findById(req.params.id);
    res.send(flowerId);
  } catch (e) {
    next(e);
  }
});

// * GET flowers by season

router.route("/flower-by-season/:season").get(async function (req, res, next) {
  try {
    // find data matching seasonid
    const flowerSeason = await Flower.find({
      season: { $regex: new RegExp(`^${req.params.season}$`, "i") },
    });

    res.send(flowerSeason);
  } catch (e) {
    next(e);
  }
});

// * POST a new flower

router.route("/flowers").post(async function (req, res) {
  try {
    // create document in database
    const newFlower = await Flower.create(req.body);

    // send back flower with appropriate status code
    res.status(201).send(newFlower);
  } catch (e) {
    if (e.name === "ValidationError") {
      res.status(404).json({
        message:
          "The data you provided was not valid. please provide valid data",
      });
      // check if flower already exists
    } else if (e.code === 11000) {
      res
        .status(409)
        .send({ message: "A flower with this name already exists" });
    } else
      res.send({
        message:
          "Something went wrong. Please check your request and try again!",
      });
  }
});

// * DELETE flower by id

router.route("/flowers/:id").delete(async function (req, res, next) {
  try {
    // find data matching id
    const id = req.params.id;
    const deleteFlower = await Flower.findByIdAndDelete(id).exec();

    res.send(deleteFlower);
  } catch (e) {
    next(e);
  }
});

// * PUT new flower data

router.route("/flowers/:name").put(async function (req, res) {
  try {
    const flowerName = req.params.name;
    const updatedData = req.body;

    const updatedFlower = await Flower.findOneAndUpdate(
      { name: flowerName },
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    res.send(updatedFlower);
  } catch (e) {
    //   check if the data provided is valid
    if (e.name === "ValidationError") {
      res.status(404).json({
        message:
          "The data you provided was not valid. please provide valid data",
      });
    } else {
      res.send({
        message:
          "Something went wrong. Please check your request and try again!",
      });
    }
  }
});

export default router;
