const express = require("express");

const app = express();


app.get('/customer', (req, res) => {
  res.json({
    name: "Vincenzo",
    surname: "Chianese"
  });
});

app.listen(3000, () => { console.log("Ready to go!"); });
