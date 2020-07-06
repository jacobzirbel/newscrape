const cheerio = require("cheerio");
const axios = require("axios");

const scrapeOnion = () => {
  const urlRegExp = /(https:\/\/.+\..*)"/gi;
  axios
    .get("https://www.theonion.com")
    .then((response) => {
      console.log("NOW");
      const data = [];
      const $ = cheerio.load(response.data);
      $("article").each((i, e) => {
        const article = {};
        let a = $(e).children("div").last().children("a");
        let headline = $(a.last()).children("h4").last().text();
        let dataGa = $(a).attr("data-ga");
        if (dataGa && headline) {
          article.link = dataGa.match(urlRegExp);
          article.headline = headline;
          data.push(article);
        }
      });
      console.log(data);
    })
    .catch((error) => {
      console.log("AXIOS ERROR");
      console.error(error);
    });
};

const scrapeReddit = () => {
  axios
    .get("https://old.reddit.com/r/nottheonion/")
    .then((response) => {
      console.log("NOW");
      const data = [];
      const $ = cheerio.load(response.data);
      $("div.link").each((i, e) => {
        const article = {};
        let a = $(e).find("div.entry").find("a.title");
        let headline = $(a).text();
        let link = $(a).attr("href");
        if (link && headline) {
          article.link = link;
          article.headline = headline;
          data.push(article);
        }
      });
      console.log(data);
    })
    .catch((error) => {
      console.log("AXIOS ERROR");
      console.error(error);
    });
};

module.exports = { scrapeOnion, scrapeReddit };
