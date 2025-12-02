import express from "express";
import { config } from "dotenv";
import compression from "compression";
import cookieParser from "cookie-parser";
import Db from "./src/database/Db.js";
import cluster from "cluster"
import os from "os"
import cors from "cors";
import { userRoutes } from "./src/routes/user.routes.js";

config();

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//todo user middleware for to merege aur routes
app.use("/api/vi/user", userRoutes)

app.get("/", (req, res) => {
  res.send("Welcome to Auto Generated Backend!");
});

if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) cluster.fork();
} else {
  Db().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log("🚀 Server running at http://localhost:" + PORT)
    );
  });
}
