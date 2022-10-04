// EXPRESS
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const Campground = require("./models/campground");

// JOI -> Schema Validation
const Joi = require("joi");

// ERRORS
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");

// EJS-MATE
const ejsMate = require("ejs-mate");

// use ejs-locals for all ejs templates:
app.engine("ejs", ejsMate);

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

app.get(
  "/campgrounds",
  wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("allCampgrounds", { campgrounds });
  })
);

// ADDING A NEW CAMPGROUND
app.get("/campgrounds/new", (req, res) => {
  res.render("newCampground");
});

app.post(
  "/campgrounds",
  wrapAsync(async (req, res) => {
    // console.log("newwwie", req.body);
    // we can also save()
    // if (!req.body) throw new ExpressError(400, "Invalid Campground Data!");

    // the joi validation happens before the mongoose validation
    const campgroundSchema = Joi.object({
      title: Joi.string().required(),
      location: Joi.string().required(),
      image: Joi.string().required(),
      price: Joi.number().required().min(0),
      description: Joi.string().required(),
    });
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(404, msg);
    }
    console.log(result.error);
    // const campground = await Campground.insertMany([req.body]);
    res.redirect("/campgrounds");
  })
);

// VIEWING A CAMPGROUND
app.get(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campground", { campground });
  })
);

// EDIT A CAMPGROUND
app.get(
  "/campgrounds/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("edit", { campground });
  })
);

app.patch(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body);
    res.redirect(`/campgrounds/${id}`);
  })
);

// DELETE A CAMPGROUND
app.delete(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

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

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
  // res.send("OH BOY SOMETHING WENT WRONG!");
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000!");
});
