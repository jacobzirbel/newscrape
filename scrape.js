const cheerio = require("cheerio");
const axios = require("axios");

const scrapeOnion = () => {
  return new Promise((resolve, reject) => {
    const urlRegExp = /https:\/\/.+\..*\d/gi;
    axios
      .get("https://www.theonion.com")
      .then((response) => {
        const data = [];
        const $ = cheerio.load(response.data);
        $("article").each((i, e) => {
          const article = {};
          let a = $(e).children("div").last().children("a");
          let headline = $(a.last()).children("h4").last().text();
          let dataGa = $(a).attr("data-ga");
          if (dataGa && headline) {
            article.link = dataGa.match(urlRegExp)[0];
            article.headline = headline.toLowerCase();
            article.isOnion = true;
            data.push(article);
          }
        });
        if (data.length) {
          resolve(data);
        }
      })
      .catch((error) => {
        console.log("AXIOS ERROR");
        console.error(error);
        reject([]);
      });
  });
};

const scrapeReddit = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("https://old.reddit.com/r/nottheonion/")
      .then((response) => {
        const data = [];
        const $ = cheerio.load(response.data);
        $("div.link").each((i, e) => {
          const article = {};
          let a = $(e).find("div.entry").find("a.title");
          let headline = $(a).text();
          let link = $(a).attr("href");
          if (
            ![
              "trump",
              "pelosi",
              "democrat",
              "republican",
              "corona",
              "covid",
            ].some((e) => headline.toLowerCase().includes(e))
          ) {
            if (link && headline) {
              article.link = link;
              article.headline = headline.toLowerCase();
              article.isOnion = false;
              data.push(article);
            }
          }
        });
        if (data.length) {
          resolve(data);
        }
      })
      .catch((error) => {
        console.log("AXIOS ERROR");
        console.error(error);
        reject([]);
      });
  });
};

module.exports = { scrapeOnion, scrapeReddit };
