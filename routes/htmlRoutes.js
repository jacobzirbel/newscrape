const express = require("express");
const router = express.Router();
const { scrapeOnion, scrapeReddit } = require("../scrape");
const db = require("../models");
router.route("/home").get((req, res) => {
  res.render("index");
});
router.route("/play").get((req, res) => {
  db.Article.find({}).then((allArticles) => {
    let articles = allArticles.sort(() => Math.random() - 0.5).slice(0, 7);
    articles = articles.map((e) => ({ headline: e.headline, id: e._id }));
    res.render("play", { articles });
  });
});
router.route("allarticles").get((req, res) => {
  // res.render all where correct+incorrect > 0
  // show link/headline
});
router.route("/scrape").get((req, res) => {
  scrapeArticlesIntoDatabase((allArticles) => {
    res.render("index");
  });
});

module.exports = router;

function scrapeArticlesIntoDatabase(callback) {
  // TODO: check when last scrape was, only scrape once per hour

  // Run both scrapes and mongodb query concurrently
  let dbPromise = db.Article.find({});
  Promise.all([scrapeReddit(), scrapeOnion(), dbPromise]).then((allData) => {
    let dbArticles = allData[2];
    let scrapedArticles = [...allData[0], ...allData[1]];
    // Remove from scrapedArticles if headline already exists in db
    scrapedArticles = scrapedArticles.filter((scrapedArticle) => {
      return !dbArticles.find((dbArticle) => {
        return dbArticle.headline === scrapedArticle.headline;
      });
    });
    db.Article.insertMany(scrapedArticles).then(() => {
      callback();
    });
  });
}
