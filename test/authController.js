let expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

let User = require("../models/user");
let authMiddleware = require("../middleware/auth");
let userController = require("../controllers/userControllers");

/* describe("Auth Controller", () => {
  it("should throw a 500 error if accessing the DB fails", async () => {
    //sinon.stub(User, "findOne");

    //User.findOne.throws();

    // User.findOne.returns({
    //   name: "ahmed",
    //   password: "ahmede_negad",
    // });

    let req = {
      body: {
        email: "ahmed@test.com",
        password: "qweasd",
      },
    };
    let res = {};

    // userController
    //   .login(req, res, () => {})
    //   .then((result) => {
    //     //console.log(result.statusCode);
    //     console.log({ result });
    //     expect(result).to.be.an("error");
    //     //expect(result).to.have.property("statusCode", 401);
    //   });

    let result = await userController.login(req, res, () => {});
    console.log({ result });

    // userController
    //   .login(req, res, () => {})
    //   .then((result) => {
    //     console.log(result);
    //   });

    // expect(userController.login.bind(this, req, res, () => {})).to.throw(
    //   "Wrong Password"
    // );

    //User.findOne.restore();
  });
}); */
