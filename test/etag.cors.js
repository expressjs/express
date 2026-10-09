"use strict";
var assert = require("node:assert");
var express = require("..");
var request = require("supertest");
const { Buffer } = require("node:buffer");

describe("ETag and CORS interaction", function () {
  it("should generate different ETags when Access-Control-Allow-Origin differs", function (done) {
    var app = express();

    app.enable("etag");

    app.use(function (req, res) {
      var origin = req.get("Origin") || "https://a.example";
      res.set("Access-Control-Allow-Origin", origin);
      res.send("same-body");
    });

    request(app)
      .get("/")
      .set("Origin", "https://a.example")
      .expect(200)
      .end(function (err, res1) {
        if (err) return done(err);
        var etag1 = res1.headers["etag"];

        request(app)
          .get("/")
          .set("Origin", "https://b.example")
          .expect(200)
          .end(function (err, res2) {
            if (err) return done(err);
            var etag2 = res2.headers["etag"];
            assert.notStrictEqual(
              etag1,
              etag2,
              "ETag should differ for different Access-Control-Allow-Origin"
            );
            done();
          });
      });
  });

  it("should be backward compatible with custom etag functions (extra arg ignored)", function (done) {
    var app = express();

    app.set("etag", function (body, encoding) {
      var chunk = !Buffer.isBuffer(body) ? Buffer.from(body, encoding) : body;
      assert.strictEqual(chunk.toString(), "same-body");
      return '"custom"';
    });

    app.use(function (req, res) {
      res.send("same-body");
    });

    request(app).get("/").expect("ETag", '"custom"').expect(200, done);
  });
});
