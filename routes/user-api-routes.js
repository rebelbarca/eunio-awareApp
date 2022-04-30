// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {
  // GET route for getting all of the users
  app.get("/api/user", function(req, res) {
    db.User.findAll({
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  // Get route for retrieving a single user
  app.get("/api/user/:id", function(req, res) {
    // 2. Add a join here to include the Author who wrote the Post
    db.User.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbUser) {
      console.log(dbUser);
      res.json(dbUser);
    });
  });

  // POST route for saving a new post
  // POST route for saving a new todo. You can create a todo using the data on req.body
  app.post("/api/user", function (req, res) {
    let bodyResult = req.body;
    console.log(bodyResult);
    db.User.create({
      user: req.body.user,
      businessType: req.body.businessType,
      lat: req.body.lat,
      lon: req.body.lon
    }).then(function () {
      console.log("user created successfully");
      res.end();
    }).catch(function (err) {
      res.status(401).json(err)
    })
  });

  // DELETE route for deleting posts
  app.delete("/api/user/:id", function(req, res) {
    db.User.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    }).catch(function(error){
      res.error(error)
    })
  });
};
