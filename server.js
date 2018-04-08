// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

// Initialize Express
var app = express();

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {});

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Express
var app = express();
app.use(express.static("public"));

var db = require("./models");

// Scrape data
app.get("/scrape", function (req, res) {

    request("http://www.bbc.com/news", function (error, response, html) {
        // Load the html body from request into cheerio
        var $ = cheerio.load(html);

        $(".gs-c-promo-body").each(function (i, element) {

            var title = $(element).children("div").children("a").children("h3").text();
            var summary = $(element).children("div").children("p").text();
            var link = $(element).children("div").children("a").attr("href");
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = title;
            result.summary = summary;
            result.link = link;
            console.log("HERE");
            console.log(result);

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });
        // res.send(index.html);
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});