const thePath = require("path");

const imageValidation = (req, res) => {
  console.log("-- from image validation --");
  //console.log(req.body.title);

  const image = req.files.image;

  const extensionName = thePath.extname(image.name);
  const allowedExtension = [".png", ".jpg", ".jpeg"];

  if (!allowedExtension.includes(extensionName)) {
    console.log("--wrong image type --");
    console.log({ extensionName });
    // return res.status(422).json({
    //   message: "wrong image type",
    // });
    let error2 = new Error("wrong image type");
    throw error2;
  }
  let rnd = Date.now();
  let imageUrl = "images/" + rnd + extensionName;
  image.mv(imageUrl, (error3) => {
    if (error3) {
      //console.log(error3);
      // return res.status(422).json({
      //   message: "no image was selected",
      // });
      //let error4 = new Error("no image provided");
      throw error3;
    } else {
      console.log("-- image saved successfully --");
    }
  });

  return imageUrl;
};

module.exports = imageValidation;
