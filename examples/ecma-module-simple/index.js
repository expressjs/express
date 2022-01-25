import express from "express";

const Express = express;

const router = Express.Router();

router.get("/", (req, res) => {
    res.send("Hello World");
    res.end();
});

const server = Express();
server.use(router);
server.listen(3000);
