// require("dotenv").config();// can not be used here as this type has been set to module, only import will work
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.on("error", (error) => console.log("ERROR:" + error));

    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running on port:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("mongoDB connection failed", err);
  });

/*import mongoose from "mongoose";
import { DB_NAME } from "./constants";


import express from "express";
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    app.on("error", (error) => console.log("ERROR:" + error));

    app.listen(process.env.PORT, () =>
      console.log(`app is listening on ${process.env.PORT}`)
    );
  } catch (error) {
    console.error("ERROR:" + error);
    throw err;
  }
})();
*/
