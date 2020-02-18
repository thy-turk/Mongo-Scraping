var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var PORT = process.env.PORT || 3000;

var db = require("./models");

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/", function (req, res) {
    res.render("land");
})

app.get("/savedpage", function (req, res) {
    res.render("saved");
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

        })
        res.send("Scrape Complete");
    })
});

app.get("/articles", function (req, res) {
    db.Article.find({ saved: false }).sort({ "_id": -1 })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// app.get("/articles/:id", function (req, res) {
//     db.Article.find({ saved: false }).sort({ "_id": -1 })
//         db.Comment.create(req.body)
//         .then(function (dbComment) {
//         return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
//         })
//         .then(function (dbArticle) {
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             res.json(err);
//         });
// });


app.get("/saved", function (req, res) {
    db.Article.find({ saved: true }).sort({ "_id": -1 })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/saved/:id", function (req, res) {
    db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { saved: true } }
    )
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err)
        })
});

app.post("/remove/:id", function (req, res) {
    db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { saved: false } }
    )
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err)
        })
})

app.listen(PORT, function () {
    console.log("App running at http://localhost:" + PORT);
});