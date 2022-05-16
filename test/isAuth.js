let expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");
let authMiddleware = require("../middleware/auth");

describe("Auth Middleware", () => {
  it("check for auth header", () => {
    let req = {
      get: function () {
        return null;
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "No Authorization Provided"
    );
  });

  it("should yield a userId after decoding the token", () => {
    let req = {
      get: function () {
        return "bearer bnnvv332njdnksd9999";
      },
    };

    sinon.stub(jwt, "verify");

    jwt.verify.returns({ userId: "abc" });

    authMiddleware(req, {}, () => {});

    expect(req).to.have.property("userId");
    jwt.verify.restore();
  });

  // it("should add userId to req", () => {

  // });
});
