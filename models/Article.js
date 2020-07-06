const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ArticleSchema = new Schema({
  headline: String,
  link: String,
  isOnion: Boolean,
  correct: { type: Number, default: 0 },
  incorrect: { type: Number, default: 0 },
  scrapedDate: { type: Date, default: Date.now },
});

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
