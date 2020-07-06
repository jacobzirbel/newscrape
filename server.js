const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 4200;
const exphbs = require("express-handlebars");
const { apiRoutes, htmlRoutes } = require("./routes");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

app.get("/*", (req, res) => {
  res.redirect("/home");
});
app.listen(PORT, () => {
  console.log("listening on " + PORT);
});
