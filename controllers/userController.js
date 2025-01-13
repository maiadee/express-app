import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.route("/user/new").get(async function (req, res, next) {
  try {
    res.render("user/signup.ejs");
  } catch (e) {
    next(e);
  }
});

router.route("/auth/signup").post(async function (req, res) {
  // create document in database
  await User.create(req.body);

  // ?do i want to redirect to another page?
  res.redirect("/user/login");
});

router.route("/user/login").get(async function (req, res, next) {
  try {
    res.render("user/login.ejs");
  } catch (e) {
    next(e);
  }
});

router.route("/auth/login").post(async function (req, res) {
  // create document in database
  await User.create(req.body);

  // ?do i want to redirect to another page?
  res.redirect("/");
});

export default router;
