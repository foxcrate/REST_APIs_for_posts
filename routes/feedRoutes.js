const express = require("express");
const { body } = require("express-validator");
const uploader = require("express-fileupload");

const feedController = require("../controllers/feedControllers");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/posts", auth, feedController.getPosts);

router.post(
  "/post",
  auth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.postPost
);

router.get("/postDetails/:postId", auth, feedController.getPostDetails);

router.put(
  "/post/:postId",
  auth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.editPost
);

router.delete("/post/:postId", auth, feedController.postDelete);

module.exports = router;
