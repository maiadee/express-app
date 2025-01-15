import express from "express";
import Flower from "../models/flowers.js";

const router = express.Router();

router.route("/flowers/:id/comments").post(async function (req, res, next) {
  try {
    if (!req.session.user) {
      return res.render("error.ejs");
    }
    // give the comment a user
    req.body.user = req.session.user;

    const flower = await Flower.findById(req.params.id);
    console.log(flower);
    //   push comment to the body
    flower.comments.push(req.body);
    //   save on the database
    flower.save();

    res.redirect(`/flowers/${req.params.id}`);
  } catch (e) {
    next(e);
    console.log(e);
  }
});

router
  .route("/flowers/:id/comments/:commentId")
  .delete(async function (req, res, next) {
    try {
      if (!req.session.user) {
        return res.render("error.ejs");
      }
      // find flower by id
      const flower = await Flower.findById(req.params.id);
      // find the comment id that i want to delete
      const commentIndex = flower.comments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );

      if (commentIndex === -1) {
        return res.send({ message: "Comment not found" });
      }
      // check comment was posted by current user
      if (
        flower.comments[commentIndex].user.toString() !==
        req.session.user._id.toString()
      ) {
        return res.send({
          message: "You cannot delete a comment that you did not post",
        });
      }
      // delete comment
      flower.comments.splice(commentIndex, 1);
      await flower.save();

      res.redirect(`/flowers/${req.params.id}`);
    } catch (e) {
      next(e);
      console.log(e);
    }
  });

export default router;
