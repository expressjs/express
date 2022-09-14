"use strict";

var express = require("../");

describe("app.close()", function () {
  it("Should close a single app instance", function (done) {
    var app = express();
    app.listen(9999);
    app.close(null, done);
  });

  it("Should close multipule app instances", function (done) {
    var app = express();

    app.listen(9998);
    app.listen(9999);
    var i = 0;
    app.close(null, function () {
      if (++i === 2) done();
    });
  });
});
