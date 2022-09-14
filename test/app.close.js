"use strict";

var express = require("../"),
  request = require("supertest");

describe("app.close()", function () {
  it("Should close a single app instance", function (done) {
    var app = express();

    app.get("/greet", function (req, res) {
      res.end("hi!");
    });

    app.listen(9999);
    app.close(null, done);
  });

  it("Should close multipule app instances", function (done) {
    var app = express();

    app.get("/greet", function (req, res) {
      res.end("hi!");
    });

    app.listen(9998);
    app.listen(9999);
    let i = 0;
    app.close(null, () => {
      if (++i === 2) done();
    });
  });
});
