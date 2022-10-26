const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const flash = require("connect-flash");
var cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json(),
    cookieParser(),
    session({
        resave: false,
        saveUninitialized: false,
        secret: "connect-flash",
        cookie: {
            maxAge: 60000
        }
    }),
    flash()
);

app.get("/flash", (req, res) => {
    req.flash("info", "Express and connect-flash are friends <3");
    res.redirect("/");
});

app.get("/", (req, res) => {
    let msg = req.flash("info")
    res.send(`Flash msg: ${msg}`);
});

let PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Main Server: ${PORT}`));