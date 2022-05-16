const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signUp = (req, res, next) => {
  console.log("-- signup route --");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorsArray = errors.array();
    console.log({ errorsArray });
    let errorsSlim = errorsArray.map((e) => {
      return {
        param: e.param,
        msg: e.msg,
      };
    });
    // return res.status(422).json({
    //   message: "Valdation Error",
    //   errors: errorsSlim,
    // });
    let newError = new Error("Please Validate Your Data");
    newError.type = "validation";
    newError.statusCode = 422;
    newError.body = errorsSlim;
    throw newError;
  }

  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      let newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });
      return newUser.save();
    })
    .then((result) => {
      //console.log({ result });
      res.status(201).json({
        message: "User Created Successfully",
        userId: result._id,
      });
    })
    .catch((error) => {
      next(error);
    });
};

exports.login2 = (req, res, next) => {
  console.log("-- login route --");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorsArray = errors.array();
    //console.log({ errorsArray });
    let errorsSlim = errorsArray.map((e) => {
      return {
        param: e.param,
        msg: e.msg,
      };
    });
    // return res.status(422).json({
    //   message: "Valdation Error",
    //   errors: errorsSlim,
    // });
    let newError = new Error("Please Validate Your Data");
    newError.type = "validation";
    newError.statusCode = 422;
    newError.body = errorsSlim;
    throw newError;
  }

  let email = req.body.email;
  let password = req.body.password;

  let foundedUserX;
  User.findOne({
    email: email,
  })
    .then((foundedUser) => {
      if (!foundedUser) {
        let error = new Error("User Not Found");
        error.statusCode = 401;
        throw error;
      }
      foundedUserX = foundedUser;
      //console.log({foundedUser});
      return bcrypt.compare(password, foundedUser.password);
    })
    .then((match) => {
      if (!match) {
        let error = new Error("Wrong Password");
        error.statusCode = 401;
        throw error;
      }
      //console.log({ foundedUserX });
      let token = jwt.sign(
        {
          email: email,
          userId: foundedUserX._id.toString(),
        },
        "figureOutThisHackers_98765",
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({
        token: token,
        userId: foundedUserX._id.toString(),
      });
      return;
    })
    .catch((error) => {
      console.log(error);
      next(error);
      return error;
    });
};

exports.login = async (req, res, next) => {
  try {
    console.log("-- login route --");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let errorsArray = errors.array();
      //console.log({ errorsArray });
      let errorsSlim = errorsArray.map((e) => {
        return {
          param: e.param,
          msg: e.msg,
        };
      });
      // return res.status(422).json({
      //   message: "Valdation Error",
      //   errors: errorsSlim,
      // });
      let newError = new Error("Please Validate Your Data");
      newError.type = "validation";
      newError.statusCode = 422;
      newError.body = errorsSlim;
      throw newError;
    }

    let email = req.body.email;
    let password = req.body.password;
    //console.log(email);
    let foundedUserX;
    let foundedUser = await User.findOne({
      email: email,
    });
    //console.log({ foundedUser });
    if (!foundedUser) {
      let error = new Error("User Not Found");
      error.statusCode = 401;
      throw error;
    }
    foundedUserX = foundedUser;

    let match = await bcrypt.compare(password, foundedUser.password);
    if (!match) {
      let error = new Error("Wrong Password");
      error.statusCode = 401;
      throw error;
    }

    let token = jwt.sign(
      {
        email: email,
        userId: foundedUserX._id.toString(),
      },
      "figureOutThisHackers_98765",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      token: token,
      userId: foundedUserX._id.toString(),
    });
    return 1;
  } catch (error) {
    //console.log(error);
    next(error);
    //return Promise.resolve(error);
    return [2, error];
  }
};
