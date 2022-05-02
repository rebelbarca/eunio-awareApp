/*1. import dependencies*/
const express = require("express");
const app = express();
require("dotenv").config();

/*1.1 allow parsing on request bodies*/
app.use(express.json());

/*2. import routes api */
const watsonRoutes = require("./routes/api/watson")
/*Direct requests to /routes/api/watson to Watson routes*/
app.use("/api/watson/", watsonRoutes);

/*3. start server*/
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log("Server listening on port ", port);
});
