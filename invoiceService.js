const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const apikey = require("apikey");
const axios = require("axios").default;

mongoose.Promise = global.Promise;

const Invoice = mongoose.model('invoices', {
  date: Date,
  amount: Number,
  customer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'customer' }]
});

const app = express();

app.use(apikey(function (key, next) {
  // return next(null, {});

  if (key === "adminKey")
    return next(null, { name: "admin" })
  else if (key === "userKey")
    return next(null, { name: "user" })
}));

app.use(bodyParser.json());

app.get('/:customerId/invoices/:invoiceId?', (req, res) => {
  if (!req.params.customerId)
    return res.status(400).send("CustomerID hasn't been provided");

  let query = { customer: req.params.customerId };

  if (req.params.invoiceId)
    query._id = req.params.invoiceId;

  Invoice.find(query).lean()
    .then(
    (invoices) => res.json(invoices),
    (err) => res.status(500).send(err));
});

app.post('/:customerId/invoices/', (req, res) => {

  if (!req.params.customerId)
    return res.status(400).send("CustomerID hasn't been provided");

  axios.get(`http://customers:3000/${req.params.customerId}`, { headers: { "apikey": "userKey" } }).then(
    (response) => {
      if (response.data.length === 0)
        return res.status(404).send("No customer found");

      req.body.customer = req.params.customerId;

      (new Invoice(req.body))
        .save()
        .then((entity) => res.status(201).send({ id: entity._id }),
        (err) => res.status(500).send(err));

    },
    (err) => res.status(err.response.status || 500).send(err.message || err.code));

});

mongoose.connect("mongodb://mongo/application", { useMongoClient: true })
  .then(() => app.listen(3000, () => { console.log("Application is ready to go!") }),
  (err) => console.error(`Error during database connection: ${err}`));
