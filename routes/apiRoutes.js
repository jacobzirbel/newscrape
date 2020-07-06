const express = require("express");
const router = express.Router();
router.route("/").get((req, res) => {});
router.route("/submit").post((req, res) => {
  // add to correct/incorrect counts in db
  // tell user which were correct
});
module.exports = router;
