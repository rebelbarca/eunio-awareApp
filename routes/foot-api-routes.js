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

  // GET route for getting all of the FootTraffic
  app.get("/api/foottraffic", function(req, res) {
    db.FootTraffic.findAll({
    }).then(function(dbFootTraffic) {
      res.json(dbFootTraffic);
    }).catch(function(err) {
      res.json(err);
    });
  });

  // Get route for retrieving a single FootTraffic
  app.get("/api/foottraffic/:id", function(req, res) {
    // 2. Add a join here to include the Author who wrote the Post
    db.FootTraffic.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbFootTraffic) {
      console.log(dbFootTraffic);
      res.json(dbFootTraffic);
    }).catch(function(err) {
        res.json(err);
      });
  });
};
