const express = require("express");
const router = express.Router();
const { scrapeOnion, scrapeReddit } = require("../scrape");
const db = require("../models");
const scrape = require("../scrape");
router.route("/play").get((req, res) => {
  db.Article.find({}).then((results) => {});
});
router.route("/scrape").get((req, res) => {
  let dbPromise = db.Article.find({});
  // Run both axios gets and mongodb query concurrently
  Promise.all([scrapeReddit(), scrapeOnion(), dbPromise]).then((allData) => {
    let dbArticles = allData[2];
    let scrapedArticles = [...allData[0], ...allData[1]];
    // Remove from scrapedArticles if headline already exists in db
    scrapedArticles = scrapedArticles.filter((scrapedArticle) => {
      return !dbArticles.find((dbArticle) => {
        return dbArticle.headline === scrapedArticle.headline;
      });
    });
    db.Article.insertMany(scrapedArticles).then((done) => {
      res.send("done");
    });
  });
});
module.exports = router;
