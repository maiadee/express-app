import express from "express";
import Flower from "../models/flowers.js";

const router = express.Router();

// * GET home page

router.route("/").get(async function (req, res, next) {
  try {
    res.render("home.ejs");
  } catch (e) {
    next(e);
  }
});

// * GET new flower form page

router.route("/flowers/new").get(async function (req, res, next) {
  try {
    res.render("flowers/new.ejs");
  } catch (e) {
    next(e);
  }
});

// * GET all flowers

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

// * GET flower page by id

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

// * GET errors page

router.route("/error").get(function (req, res) {
  res.render("error.ejs");
});

// * POST a new flower

router.route("/flowers").post(async function (req, res) {
  try {
    if (!req.session.user) {
      return res.redirect("/error");
    }

    if (!req.body.colors) req.body.colors = "";
    req.body.colors = req.body.colors.split(",");

    req.body.user = req.session.user;

    // create document in database
    await Flower.create(req.body);

    // ?do i want to redirect to another page?
    res.redirect("/flowers");
  } catch (e) {
    console.log(e);
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
    if (!req.session.user) {
      return res.redirect("/error");
    }
    // find data matching id
    const id = req.params.id;
    // .populate("user"), Mongoose replaces user field (just an ID) with the actual user data from the User collection.
    // you get the full user object
    const deleteFlower = await Flower.findById(id).populate("user");
    console.log(deleteFlower, req.session.user, id);

    // * Compare the user who is current logged in (req.session.user)
    // * with the user ON the destination (destination.user)
    // console.log(req.session.user._id);
    // console.log(deleteFlower.user._id);

    if (!deleteFlower.user._id.equals(req.session.user._id)) {
      return res
        .status(402)
        .send({ message: "This is not your flower to delete!" });
    }
    await Flower.findByIdAndDelete(id);

    res.redirect("/flowers");
  } catch (e) {
    next(e);
  }
});

// * DELETE flower update page by id

router.route("/flowers/update/:id").get(async function (req, res, next) {
  try {
    if (!req.session.user) {
      return res.redirect("/error");
    }
    const flower = await Flower.findById(req.params.id).exec();
    res.render("flowers/update.ejs", {
      flower: flower,
    });
  } catch (e) {
    next(e);
  }
});

// * PUT update flower data by id

router.route("/flowers/:id").put(async function (req, res) {
  try {
    if (!req.session.user) {
      return res.redirect("/error");
    }
    const flowerId = req.params.id;

    const updateFlower = await Flower.findById(flowerId, req.body, {
      new: true,
      //  Includes the full user information instead of just the user ID.
    }).populate("user");

    console.log(updateFlower, req.body, flowerId);

    if (!updateFlower.user._id.equals(req.session.user._id)) {
      return res
        .status(402)
        .send({ message: "This is not your flower to update!" });
    }

    await Flower.findByIdAndUpdate(flowerId);

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
