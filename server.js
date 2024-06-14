require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const globalErrHandler = require("./middlewares/globalErrHandler");
const userRoutes = require("./routes/users/usersRoutes");
const postRoutes = require("./routes/posts/postsRoutes");
const commentRoutes = require("./routes/comments/commentsRoutes");

require("./config/dbConnect");
const app = express();

//! middlewares
// Configure ejs
app.set("view engine", "ejs");
// Serve static files
app.use(express.static(__dirname + "/public"));
// Pass incoming data
app.use(express.json()); // pass json data
app.use(express.urlencoded({ extended: true })); // pass form data
// Session configuration
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60, // 24hours
    }),
  })
);

// Save the logged in user into locals
app.use(function (req, res, next) {
  if (req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }
  next();
});

//! routes
// Render homepage
app.get("/", (req, res) => {
  res.render("index");
});
// Users routes
app.use("/api/v1/users", userRoutes);

// Posts routes
app.use("/api/v1/posts", postRoutes);

// Comments route
app.use("/api/v1/comments", commentRoutes);

//! error handlers
app.use(globalErrHandler);

// listeners
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Server listening on port ${PORT}`));
