const express = require("express");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const app = express();

app.get('/status', (req, res) => {
  res.sendStatus(204);
});

app.get('/', (req, res) => {
  res.json({
    name: "Vincenzo",
    surname: "Chianese"
  });
});


mongoose.createConnection("mongodb://mongo/application", { useMongoClient: true })
  .then(() => {
    app.listen(3000, () => { console.log("Application is ready to go!"); });
  }).catch((err) => {
    console.error(`Error during database connection: ${err}`);
  });
