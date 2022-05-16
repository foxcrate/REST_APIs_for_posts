let expect = require("chai").expect;

describe("General", () => {
  it("should sum right", () => {
    let x = 2;
    let y = 3;
    let z = x + y;
    if (z == 5) {
      return true;
    } else {
      throw new Error("equel 5");
    }
    //expect(z).tp.equel(5);
  });
});
