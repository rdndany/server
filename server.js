require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// db
const mongoose = require("mongoose");
const connectDB = require("./utils/db");
// routes
const projectsRoute = require("./routes/projectsRoutes");

connectDB();
const app = express();

// Middlewears

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://cc-teal-beta.vercel.app/"],
    credentials: true,
  })
);

// Routes

app.use("/api/projects", projectsRoute);

app.get("/", (req, res) => {
  res.send("Home page");
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);
