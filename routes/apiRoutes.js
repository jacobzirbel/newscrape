const express = require("express");
const router = express.Router();
const db = require("../models");
router.route("/").get((req, res) => {});
router.route("/sub").get((req, res) => {
  res.json({ end: "end" });
});
router.route("/submit").post((req, res) => {
  let ret = {};
  const data = req.body.data;
  const keys = Object.keys(data);
  let findByIdPromises = keys.map((key) => db.Article.findById(key));
  Promise.all(findByIdPromises).then((results) => {
    let updatePromises = results.map((result, i) => {
      data[keys[i]] = data[keys[i]] === "true";
      let correct = data[keys[i]] === result.isOnion;
      let toIncrement = {};
      toIncrement[correct ? "correct" : "incorrect"] = 1;
      ret[keys[i]] = { link: results[i].link, correct };
      return db.Article.findByIdAndUpdate(keys[i], { $inc: toIncrement });
    });
    Promise.all(updatePromises).then(() => {
      res.json(ret);
    });
  });
});
router.route("/deletetheall").get((req, res) => {
  db.Article.remove({}, (a) => {
    console.log(a);
    res.end();
  });
});
module.exports = router;
