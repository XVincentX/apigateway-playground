const express = require("express");

const app = express();


app.get('/invoices', (req, res) => {
  res.json({
    invoiceId: "10",
    amount: 3000
  });
});

app.listen(3000, () => { console.log("Ready to go!"); });
