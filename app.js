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

// CRUD
// HOME PAGE -- ALL CAMPGROUNDS
app.get("/", (req, res) => {
  res.redirect("/campgrounds");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("allCampgrounds", { campgrounds });
});

// ADDING A NEW CAMPGROUND
app.get("/campgrounds/new", (req, res) => {
  res.render("newCampground");
});

app.post("/campgrounds", async (req, res) => {
  console.log(req.body);
  await Campground.insertMany(req.body);
  res.redirect("/campgrounds");
});

// VIEWING A CAMPGROUND
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campground", { campground });
});

// EDIT A CAMPGROUND
app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("edit", { campground });
});

app.patch("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndUpdate(id, req.body);
  res.redirect(`/campgrounds/${id}`);
});

// DELETE A CAMPGROUND
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

// app.get("/makecampground", async (req, res) => {
//   const camp = new Campground({
//     title: "Beverly Hills",
//     price: "$499",
//     description: "lorem;oeffhgjkrhjkhjkhjkfg",
//     location: "Sigatoka, Fj",
//   });
//   await camp.save();
//   res.send(camp);
// });

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000!");
});
