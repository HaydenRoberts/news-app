// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {});

// Use body-parser for handling form submissions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

require("./routes/api-routes.js")(app);
// require("./routes/html-routes.js")(app);

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
  });