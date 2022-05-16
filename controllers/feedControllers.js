const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const imageValidation = require("../util/validationSave/image");
const socketIO = require("../socketIntialization");

const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = (req, res, next) => {
  let currentPage = req.query.page || 1;
  let perPage = 2;
  let totalItems;
  console.log("-- get controller --");
  Post.find()
    .countDocuments()
    .then((count) => {
      //console.log({ count });
      totalItems = count;
      return Post.find()
        .populate("creator")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .then((result) => {
          //console.log({ result });
          res.status(200).json({
            posts: result,
            totalItems: totalItems,
          });
        });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postPost = (req, res, next) => {
  console.log("-- post controller --");
  let errors = validationResult(req);
  // console.log({ errors });
  // console.log(errors.array());
  if (!errors.isEmpty()) {
    // return res
    //   .status(422)
    //   .json({ message: "Validation Failed", errors: errors.array() });
    let err = new Error("Validation Error");
    err.statusCode = 422;
    throw err;
  }

  if (!req.files) {
    console.log("--wrong image type --");
    // return res.status(422).json({
    //   message: "no image was selected",
    // });
    let error1 = new Error("no image provided");
    throw error1;
  }

  let imageUrl = imageValidation(req, res);
  //console.log({ imageUrl });
  //return 0;

  let title = req.body.title;
  let image = imageUrl;
  let content = req.body.content;

  let post = new Post({
    //
    title: title,
    content: content,
    imageUrl: image,
    creator: req.userId,
  });

  let createdPost;
  let creator;
  post
    .save()
    .then((result) => {
      createdPost = result;
      return User.findById(req.userId);
    })
    .then((theUser) => {
      //console.log({ result });
      if (!theUser) {
        let err = new Error("User Not Found");
        err.statusCode = 404;
        throw err;
      }
      creator = theUser;
      creator.posts.push(createdPost);
      return creator.save();
    })
    .then((result) => {
      console.log(creator, createdPost);
      socketIO.getIO().emit("posts", {
        action: "create",
        post: {
          ...createdPost._doc,
          creator: { _id: creator._id, name: creator.name },
        },
      });
      res.status(201).json({
        msg: "Post Created Successfully",
        post: {
          ...createdPost._doc,
          creator: { _id: creator._id, name: creator.name },
        },
        // post: createdPost,
        // creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((error) => {
      let err = new Error(error);
      err.statusCode = 500;
      next(err);
    });
};

exports.getPostDetails = (req, res, next) => {
  console.log("--details route--");

  let postId = req.params.postId;
  //postId = 333;
  Post.findById(postId)
    .then((result) => {
      if (!result) {
        console.log("-- product not found --");
        let err = new Error("Product not found");
        err.statusCode = 404;
        throw err;
      }
      let post = result;
      //
      console.log({ post });
      res.status(200).json({ post });
    })
    .catch((err) => {
      next(err);
    });
};

exports.editPost = (req, res, next) => {
  console.log("--edit route--");
  //console.log(req.body);
  //return 0;
  let errors = validationResult(req);
  // console.log({ errors });
  // console.log(errors.array());
  if (!errors.isEmpty()) {
    // return res
    //   .status(422)
    //   .json({ message: "Validation Failed", errors: errors.array() });
    let err = new Error("Validation Error");
    err.statusCode = 422;
    throw err;
  }

  let imageUrl = null;
  if (req.files) {
    imageUrl = imageValidation(req, res);
  }

  //console.log({ imageUrl });
  //return 0;

  let title = req.body.title;
  let image = imageUrl;
  let content = req.body.content;

  let postId = req.params.postId;
  //postId = 333;
  Post.findById(postId)
    .populate("creator")
    .then((thePost) => {
      if (!thePost) {
        console.log("-- product not found --");
        let err = new Error("Product not found");
        err.statusCode = 404;
        throw err;
      }

      if (thePost.creator._id.toString() !== req.userId) {
        let error = new Error("Not the Creator");
        error.statusCode = 403;
        throw error;
      }

      thePost.title = title;
      if (imageUrl) {
        console.log("--image changed--");
        let thePath = path.dirname(process.mainModule.filename);
        // console.log({ thePath });

        fs.unlink(thePath + "/" + thePost.imageUrl, (err) => {
          if (err) {
            console.log("-- err in deleting image --");
            next(new Error(err));
          }
        });

        thePost.imageUrl = image;
      }
      thePost.content = content;

      return thePost.save().then((result) => {
        socketIO.getIO().emit("posts", {
          action: "update",
          post: result,
        });
        res.status(200).json({
          msg: "Post Updated Successfully",
          post: result,
        });
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postDelete = (req, res, next) => {
  console.log("--delete route--");
  let postId = req.params.postId;
  //postId = 333;
  let deleteResult;
  Post.findById(postId)
    //.populate("creator")
    .then((thePost) => {
      if (!thePost) {
        console.log("-- product not found --");
        let err = new Error("Product not found");
        err.statusCode = 404;
        throw err;
      }

      if (thePost.creator.toString() !== req.userId) {
        let error = new Error("Not the Creator");
        error.statusCode = 403;
        throw error;
      }

      let thePath = path.dirname(process.mainModule.filename);
      // console.log({ thePath });

      fs.unlink(thePath + "/" + thePost.imageUrl, (err) => {
        if (err) {
          console.log("-- err in deleting image --");
          next(new Error(err));
        }
      });

      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      deleteResult = result;
      User.findById(req.userId).then((theUser) => {
        theUser.posts.pull(postId);
        return theUser.save();
      });
      // res.status(200).json({
      //   msg: "Post Deleted Successfully",
      //   post: deleteResult,
      // });
    })
    .then((savedUser) => {
      socketIO.getIO().emit("posts", {
        action: "delete",
        post: deleteResult,
      });
      res.status(200).json({
        msg: "Post Deleted Successfully",
        post: deleteResult,
      });
    })
    .catch((error) => {
      next(error);
    });
};
