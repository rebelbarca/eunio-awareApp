var express = require("express")

var app = express();

var PORT = process.env.PORT || 8080;

var db = require("./models");
// const dotenv = require("dotenv");
// dotenv.config();

app.use(express.static("public"));
app.use(express.static("public/assets/images"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// var exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// routes
require("./routes/html-routes.js")(app);
require("./routes/user-api-routes.js")(app);
require("./routes/foot-api-routes.js")(app);
require("./routes/vehicle-api-routes.js")(app);

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
  });
});
