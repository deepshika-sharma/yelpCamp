// EXPRESS
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const Campground = require("./models/campground");

// MONGOOSE
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("MONGOOSE CONNECTION OPEN!!");
  })
  .catch((error) => {
    console.log("MONGOOSE CONNECTIO ERROR!!");
    console.log(error);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({
    title: "Beverly Hills",
    price: "$499",
    description: "lorem;oeffhgjkrhjkhjkhjkfg",
    location: "Sigatoka, Fj",
  });
  await camp.save();
  res.send(camp);
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000!");
});
