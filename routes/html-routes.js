// Export routes for server.js to use.
var path = require("path");
var db = require("../models")
const dotenv = require("dotenv");
dotenv.config();

// Routes
// =============================================================
module.exports = function (app) {

  // app.set('viewengine', 'ejs');

  app.get("/profile", checkAuthenticated, (req, res) => {
    res.render("index.ejs", {
      name: req.user.name,
      email: req.user.email
    })
  });

  app.get("/", checkNotAuthenticated, (req, res) => {
    res.render("login.ejs")
  });

  app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("register.ejs")
  });

  app.get("/landingPage", checkAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../views/landingPage.html"));
  });

  app.get("/favicon.ico", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/assets/images/favicon.ico/favicon.ico"));
  });

  app.get("/app", checkAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../views/googleMaps.html"));
  });

  app.get("/realTimeChat", checkAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../views/realTimeChat.html"));
  });

  app.get("/articleAPI", checkAuthenticated, function(req, res) {
    res.render('articleAPI.ejs', { name: req.user.name });
  });

  app.get("/api/articleAPI", checkAuthenticated, function(req, res) {
    res.json(req.user);
    console.log(req.user);
  });

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
  }

  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/profile')
    }
    next()
  }
  
  // app.get("/app", function(req, res) {
  //   res.render("map");
  // });
};
