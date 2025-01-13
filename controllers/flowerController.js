import express from "express";
import Flower from "../models/flowers.js";

const router = express.Router();
// !
router.route("/").get(async function (req, res, next) {
  try {
    res.render("home.ejs");
  } catch (e) {
    next(e);
  }
});

// !
router.route("/flowers/new").get(async function (req, res, next) {
  try {
    res.render("flowers/new.ejs");
  } catch (e) {
    next(e);
  }
});

// * GET all flowers
// !
router.route("/flowers").get(async function (req, res, next) {
  try {
    // find data
    const allFlowers = await Flower.find().exec();

    res.render("flowers/index.ejs", {
      allFlowers: allFlowers,
    });
  } catch (e) {
    next(e);
  }
});

// * GET flower by id
// !
router.route("/flowers/:id").get(async function (req, res, next) {
  try {
    // find data matching id
    const flowerId = req.params.id;
    const flower = await Flower.findById(flowerId);
    res.render("flowers/show.ejs", {
      flower: flower,
    });
  } catch (e) {
    next(e);
  }
});

// * GET flowers by season

// !
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

// !
router.route("/flowers").post(async function (req, res) {
  try {
    // create document in database
    await Flower.create(req.body);

    // ?do i want to redirect to another page?
    res.redirect("/flowers");
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
// !
router.route("/flowers/:id").delete(async function (req, res, next) {
  try {
    // find data matching id
    const id = req.params.id;
    const deleteFlower = await Flower.findByIdAndDelete(id).exec();

    res.redirect("/flowers");
  } catch (e) {
    next(e);
  }
});

// !
router.route("/flowers/update/:id").get(async function (req, res, next) {
  try {
    const flower = await Flower.findById(req.params.id).exec();
    res.render("flowers/update.ejs", {
      flower: flower,
    });
  } catch (e) {
    next(e);
  }
});

// * PUT new flower data
// !
router.route("/flowers/:id").put(async function (req, res) {
  try {
    const flowerId = req.params.id;

    const updatedFlower = await Flower.findByIdAndUpdate(flowerId, req.body, {
      new: true,
    });

    res.redirect("/flowers");
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
