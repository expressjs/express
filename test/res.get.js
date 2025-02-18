"use strict";

var express = require("..");
// const express = require("express");
var request = require("supertest");

describe("res", function () {
  describe(".get(field)", function () {
    it("should get the response header field", function (done) {
      var app = express();

      app.use(function (req, res) {
        res.setHeader("Content-Type", "text/x-foo");
        res.send(res.get("Content-Type"));
      });

      request(app).get("/").expect(200, "text/x-foo", done);
    });
  });
});

describe("res", function () {
  describe(".get(field)", function () {
    it("should get the response header field", async function (done) {
      const app = express();

      // Middleware that sets a header and retrieves it
      app.use(function (req, res) {
        res.setHeader("Content-Type", "application/json"); // Set Content-Type header
        res.setHeader("X-Custom-Header", "my-custom-value"); // Set a custom header
        res.send(res.get("X-Custom-Header")); // Get and send the value of X-Custom-Header
      });

      // Test the response

      request(app)
        .get("/") // Make a GET request to the root
        .expect(200) // Expect a 200 OK status
        .expect(JSON.parse({ msg: "my-custom-value" }), done); // Expect the header 'X-Custom-Header' to have value 'my-custom-value'
    });
  });
});
