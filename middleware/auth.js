const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.get("Authorization");
  //console.log({ token });

  if (!token) {
    let error = new Error("No Authorization Provided!");
    error.statusCode = 401;
    throw error;
  }

  try {
    let decodedToken = jwt.verify(token, "figureOutThisHackers_98765");
    if (decodedToken) {
      req.userId = decodedToken.userId;
      //return res.status(200).json({ msg: "successfull" });
      next();
    }
  } catch (error) {
    error.statusCode = 422;
    error.body = "JWT Error";
    throw error;
  }
};
