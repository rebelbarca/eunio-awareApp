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

  // GET route for getting all of the VehicleTraffic
  app.get("/api/vehicletraffic", function(req, res) {
    db.VehicleTraffic.findAll({
    }).then(function(dbVehicleTraffic) {
      res.json(dbVehicleTraffic);
    });
  });

  // Get route for retrieving a single VehicleTraffic
  app.get("/api/vehicletraffic/:id", function(req, res) {
    // 2. Add a join here to include the Author who wrote the Post
    db.VehicleTraffic.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbVehicleTraffic) {
      console.log(dbVehicleTraffic);
      res.json(dbVehicleTraffic);
    });
  });
};
