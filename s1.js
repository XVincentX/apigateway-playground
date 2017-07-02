const express = require("express");

const app = express();


app.get('/', (req, res) => {
  console.log("s2 hit");
  res.json({
    name: "Vincenzo",
    surname: "Chianese"
  });
});

app.listen(3000, () => { console.log("Ready to go!"); });
