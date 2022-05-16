const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const userController = require("../controllers/userControllers");
const auth = require("../middleware/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .custom((value, { req }) => {
        return User.findOne({
          email: value,
        })
          .then((result) => {
            //console.log({ result });
            if (result) {
              return Promise.reject("error");
            }
          })
          .catch((error) => {
            next(error);
          });
      })
      .withMessage("Repeated Email Message"),
    //.normalizeEmail(),
    body("password", "Password has to be valid.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  userController.signUp
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email address."),
    body("password")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .withMessage("Password has to be valid."),
  ],
  //auth,
  userController.login
);

module.exports = router;
