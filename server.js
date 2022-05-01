const express= require("express");
const bcrypt= require("bcrypt");
// const cors= require('cors')
const app= express();
const passport= require('passport')
const initializePassport= require('./passport-config');
const flash= require('express-flash');
const session= require('express-session');
const dotenv = require("dotenv");
const methodOverride= require('method-override')
const server= require('http').Server(app);
const io= require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

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
// app.use(cors());

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
  res.redirect('/')
});

app.post("/api/login", passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/',
  failureFlash: true
}));

app.post("/api/landingPage", async (req, res) => {
  try {
    res.redirect('/landingPage')
  } 
  catch {
    res.redirect('/profile')
  }
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
    res.redirect('/')
  } 
  catch {
    res.redirect('/register')
  }
  console.log(users)
});

const userTags= {}

io.on('connection', socket => {
  socket.on('new-user', userTag => {
    userTags[socket.id]= userTag
    socket.broadcast.emit('user-connected', userTag)
  })
  // console.log('new User')
  // socket.emit('chat-message', 'Hello World')
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', {
      message: message,
      userTag: userTags[socket.id]
    })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', userTags[socket.id])
    delete userTags[socket.id]
  })
});

// routes
require("./routes/html-routes.js")(app);
require("./routes/user-api-routes.js")(app);
require("./routes/foot-api-routes.js")(app);
require("./routes/vehicle-api-routes.js")(app);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

db.sequelize.sync().then(function() {
  server.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
  });
});
