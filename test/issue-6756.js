var express = require("..");
var request = require("supertest");
var assert = require("assert");

describe("Issue #6756: BigInt status code", function () {
  it("should throw a helpful TypeError when passing a BigInt to res.sendStatus", function (done) {
    var app = express();

    app.use(function (req, res) {
      try {
        res.sendStatus(200n);
      } catch (err) {
        res.send(err.message);
      }
    });

    request(app)
      .get("/")
      .expect(200)
      .expect(function (res) {
        assert.match(res.text, /Invalid status code/);
        assert.match(res.text, /bigint/);
      })
      .end(done);
  });

  it("should throw a helpful TypeError when passing a BigInt to res.status", function (done) {
    var app = express();

    app.use(function (req, res) {
      try {
        res.status(200n).send("ok");
      } catch (err) {
        res.send(err.message);
      }
    });

    request(app)
      .get("/")
      .expect(200)
      .expect(function (res) {
        assert.match(res.text, /Invalid status code/);
        assert.match(res.text, /bigint/);
      })
      .end(done);
  });

  it("should throw a helpful TypeError when passing Object.create(null) to res.status", function (done) {
    var app = express();

    app.use(function (req, res) {
      try {
        res.status(Object.create(null)).send("ok");
      } catch (err) {
        res.send(err.message);
      }
    });

    request(app)
      .get("/")
      .expect(200)
      .expect(function (res) {
        assert.match(res.text, /Invalid status code/);
        assert.match(res.text, /object/);
      })
      .end(done);
  });
});
