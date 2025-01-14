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

router.route("/user/signup").post(async function (req, res, next) {
  try {
    //   add password restrictions
    const { password, passwordConfirmation } = req.body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.",
      });
    }

    if (password !== passwordConfirmation) {
      return res.status(400).send({ message: "Passwords do not match" });
    }
    // create document in database
    await User.create(req.body);

    // ?do i want to redirect to another page?
    res.redirect("/user/login");
  } catch (e) {
    next(e);
  }
});

router.route("/user/login").get(async function (req, res, next) {
  try {
    res.render("user/login.ejs");
  } catch (e) {
    next(e);
  }
});

router.route("/user/logout").get(async function (req, res, next) {
  req.session.destroy()
});

router.route("/user/login").post(async function (req, res, next) {
  try {
    // ? We need to know if the login was actually successful!
    // 1) Get the user for this login attempt (with email)
    const user = await User.findOne({ email: req.body.email });
    // 2) Compare the 2 password hashes to see if they're the same.
    // ! This will check if the login is a failure, and respond accordingly.
    if (!user.isPasswordValid(req.body.password)) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // If we succeed, we do this later:
    req.session.user = user;
    res.redirect("/");
  } catch (e) {
    next(e);
  }
});

export default router;
