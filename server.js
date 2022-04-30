const express= require("express");
const bcrypt= require("bcrypt");
const app= express();
const passport= require('passport')
const initializePassport= require('./passport-config');
const flash= require('express-flash');
const session= require('express-session');
const dotenv = require("dotenv");
const methodOverride= require('method-override')
dotenv.config();

const users= [];

initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

var PORT= process.env.PORT || 8080;

app.set('viewengine', 'ejs');

var db = require("./models");
// const dotenv = require("dotenv");
// dotenv.config();

app.use(express.static("public"));
app.use(express.static("public/assets/images"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// var exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");
app.delete("/api/logout", (req, res) => {
  req.logOut()
  res.redirect('/login')
});

app.post("/api/login", passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
})); 

app.post("/api/landingPage", async (req, res) => {
  res.redirect('/landingPage')
}); 

app.post("/api/register", async (req, res) => {
  try {
    const hashedPassword= await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } 
  catch {
    res.redirect('/register')
  }
  console.log(users)
});

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
