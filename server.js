"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var T2M = require("./T2M");
T2M = new T2M();

//Init
var app = express();

app.use(cors());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

//Routing
app.get("/", function(req, res) {
  res.send("Hello World");
});

//      title: body.Title,
//       text: body.Text,
//       preciseSearch: body.PreciseSearch,
//       optionsDropDown: body.OptionsDropDown
app.get("/api/submit", function(req, res) {
  let text = req.query.text;
  let title = req.query.title;
  let preciseSearch = req.query.preciseSearch;

  let obj = {
    text: text,
    title: title,
    preciseSearch: preciseSearch
  };
  T2M.createSoundFile(obj, (error, pathToSoundFile) => {
    if (error !== null) {
      return res.send("Error occurred creating sound file: " + error);
    }
    res.send("/" + pathToSoundFile);
  });
});

app.listen(1247);
console.log("Listening on Port 1247");
