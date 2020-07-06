const express = require("express");
const router = express.Router();
const { scrapeOnion, scrapeReddit } = require("../scrape");
const db = require("../models");

router.route("/play").get((req, res) => {
  db.Article.find({}).then((allArticles) => {
    let articles = allArticles.sort(() => Math.random() - 0.5).slice(0, 2);
    articles = articles.map((e) => ({ headline: e.headline, id: e._id }));
    res.render("play", { articles });
  });
});
router.route("allarticles").get((req, res) => {
  // res.render all where correct+incorrect > 0
  // show link/headline
});
router.route("/home").get((req, res) => {
  scrapeArticlesIntoDatabase(() => {
    res.render("index");
  });
});

module.exports = router;

function scrapeArticlesIntoDatabase(callback) {
  const scrape = (articles) => {
    Promise.all([scrapeReddit(), scrapeOnion()]).then((allData) => {
      let dbArticles = articles;
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
  };
  const DAY_IN_MS = 1000 * 60 * 60 * 24;
  db.Article.find({}).then((articles) => {
    if (!articles) scrape();
    let mostRecentScrape = articles
      .map((a) => a.scrapedDate.getTime())
      .sort((a, b) => b - a)[0];
    if (mostRecentScrape < Date.now() - DAY_IN_MS) {
      scrape(articles);
    } else {
      callback();
    }
  });
}
