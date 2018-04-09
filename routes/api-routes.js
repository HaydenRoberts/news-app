var request = require("request");
var cheerio = require("cheerio");
var db = require("../models");


// Scrape data
module.exports = function (app) {
    app.get("/scrape", function (req, res) {
        request("https://www.bbc.com/news", function (error, response, body) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode)

            var $ = cheerio.load(body);
            $(".gs-c-promo-body").each(function (i, element) {
                var result = {};
                result.headline = $(this)
                    .children()
                    .find("h3")
                    .text();
                result.summary = $(this)
                    .find("p")
                    .text();
                result.link = $(this)
                    .find("a")
                    .attr("href");
                // The articles are not being updated on page load. TODO run check to see if article has been loaded to db, and if not post. 

                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        return res.json(err);
                    });
            });
            res.send("Nice!");
        });
    });

    app.get("/articles", function (req, res) {
        db.Article.find({})
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("note")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.post("/articles/:id", function (req, res) {
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });
}