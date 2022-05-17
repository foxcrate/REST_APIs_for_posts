const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const uploader = require("express-fileupload");

const feedRoutes = require("./routes/feedRoutes");
const authRoutes = require("./routes/authRoutes");
const { clear } = require("console");

const app = express();

const MONGODB_URI = process.env.MONGODB_URI;
//console.log(MONGODB_URI);
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    const server = app.listen(8000);
    clear();
    const io = require("./socketIntialization").init(server);
    io.on("connection", (stream) => {
      console.log("someone connected with id: ", stream.id);
    });
    console.log("-- server started --");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});
app.use(uploader());

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log("-- error middleware --");
  console.log({ error });
  let status = error.statusCode || 500;
  let errorBody;
  if (error.body) {
    errorBody = error.body;
  }
  // let error = new Error(error.message);
  let errorMsg = error.message;
  res.status(status).json({
    message: errorMsg,
    body: errorBody ? errorBody : null,
  });
});
