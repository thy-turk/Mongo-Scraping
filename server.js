var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var PORT = 3000;

var db = require("./models");

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/", function (req, res) {
    res.send("Fuck you")
})

app.get("/drop", function (req, res) {
    mongoose.connection.collections["articles"].drop();

    res.send("Articles Dropped")
})

app.get("/scrape", function (req, res) {
    axios.get("http://www.echojs.com/").then(function (response) {
        var $ = cheerio.load(response.data);

        $("article h2").each(function (i, element) {
            var result = {};

            result.headline = $(this).children("a").text();

            result.url = $(this).children("a").attr("href");

            result.summary = "Test Summary"

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle)
                })
                .catch(function (err) {
                    console.log(err);
                });

            // var headline = temp;
            // var summary = temp;
            // var url = temp;

        })
        res.send("Scrape Complete");
    })
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

app.listen(PORT, function () {
    console.log("App running at http://localhost:" + PORT);
});