const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const router = require("./Routes/index.js");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.options("*", cors());

app.use("/v1", router);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB connected successfully");
    app.listen(process.env.PORTNUM, () => {
      console.log("Server successfully started on " + process.env.PORTNUM);
    });
  })
  .catch((error) => {
    console.log("DB failed to connect " + error);
  });
