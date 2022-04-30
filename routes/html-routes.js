// Export routes for server.js to use.
var path = require("path");
var db = require("../models")
const dotenv = require("dotenv");
dotenv.config();

// Routes
// =============================================================
module.exports = function (app) {

  // app.set('viewengine', 'ejs');

  app.get("/", checkAuthenticated, (req, res) => {
    res.render("index.ejs", { name: req.user.name })
  });

  app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login.ejs")
  });

  app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("register.ejs")
  });

  app.get("/landingPage", checkAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../views/landingPage.html"));
  });

  app.get("/favicon.ico", checkAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/assets/images/favicon.ico/favicon.ico"));
  });

  app.get("/app", checkAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../views/googleMaps.html"));
  });

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }

  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  
  // app.get("/app", function(req, res) {
  //   res.render("map");
  // });
};
