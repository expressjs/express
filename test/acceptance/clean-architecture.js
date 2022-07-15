var app = require("../../examples/clean-architecture");
var request = require("supertest");

describe("clean-architecture-crud", function () {
  describe("GET /", function () {
    it("should return empty array", function (done) {
      request(app).get("/notes").expect(200, [], done);
    });

    it("list after creation", function (done) {
      request(app)
        .post("/notes")
        .set("Content-Type", "application/json")
        .send('{"title": "Text"}')
        .expect(201)
        .then(function (res) {
          const obj = {
            title: "Text",
            id: 0,
          };
          request(app)
            .get("/notes")
            .expect(function (res) {
              obj.createdAt = res.body[0].createdAt;
              obj.updatedAt = res.body[0].updatedAt;
            })
            .expect(200, [obj], done);
        });
    });
  });

  describe("GET /:id", function () {
    it("get after creation", function (done) {
      request(app)
        .post("/notes")
        .set("Content-Type", "application/json")
        .send('{"title": "Text"}')
        .expect(201, function (err, res) {
          if (err) return done(err);
          request(app)
            .get("/notes/" + res.body.id)
            .expect(200, function (err, res) {
              if (err) return done(err);
              if (res.body.title === "Text") {
                done();
              }
            });
        });
    });

    it("return error if cannot find by id", function (done) {
      request(app).get("/notes/100").expect(404, done);
    });
  });

  describe("POST /", function () {
    it("validation error on title", function (done) {
      request(app)
        .post("/notes")
        .set("Content-Type", "application/json")
        .send('{"title": ""}')
        .expect(400, done);
    });

    it("creation ok", function (done) {
      request(app)
        .post("/notes")
        .set("Content-Type", "application/json")
        .send('{"title": "Text"}')
        .expect(201, done);
    });
  });

  describe("POST /", function () {
    it("validation error on title", function (done) {
      request(app)
        .post("/notes")
        .set("Content-Type", "application/json")
        .send('{"title": ""}')
        .expect(400, done);
    });
  });

  describe("DELETE /", function () {
    it("delete after creation", function (done) {
      request(app)
        .post("/notes")
        .set("Content-Type", "application/json")
        .send('{"title": "Text"}')
        .expect(201, function (err, res) {
          if (err) return done(err);
          request(app)
            .delete("/notes/" + res.body.id)
            .expect(200, done);
        });
    });

    it("delete unexisting node", function (done) {
      request(app).delete("/notes/100").expect(400, done);
    });
  });

  describe("put /", function () {
    it("update after creation", function (done) {
      request(app)
        .post("/notes")
        .set("Content-Type", "application/json")
        .send('{"title": "Text"}')
        .expect(201, function (err, res) {
          if (err) return done(err);
          request(app)
            .put("/notes/" + res.body.id)
            .send({ title: "Test2" })
            .expect(200, '"Note updated"', done);
        });
    });

    it("error in update after creation", function (done) {
      request(app)
        .post("/notes")
        .set("Content-Type", "application/json")
        .send('{"title": "Text"}')
        .expect(201, function (err, res) {
          if (err) return done(err);
          request(app)
            .put("/notes/" + res.body.id)
            .send({ title: "" })
            .expect(400, done);
        });
    });

    it("try to update post not found", function (done) {
      request(app).put("/notes/100").send({ title: "Test1" }).expect(400, done);
    });
  });
});
