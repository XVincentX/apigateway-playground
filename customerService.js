const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose.Promise = global.Promise;

const Customer = mongoose.model('customers', {
  name: String,
  surname: String
});

const Invoice = mongoose.model('invoices', {
  date: Date,
  amount: Number,
  customer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'customer' }]
});

const app = express();

app.use(bodyParser.json());

app.get('/customers/:id?', (req, res) => {
  let query = {};

  if (req.params.id)
    query._id = req.params.id;

  Customer.find(query).lean()
    .then(
    (customers) => res.json(customers),
    (err) => res.status(500).send(err));
});

app.post('/customers/', (req, res) => {
  (new Customer(req.body))
    .save()
    .then(
    (entity) => res.status(201).send({ id: entity._id }),
    (err) => res.status(500).send(err));
});

app.get('/customers/:customerId/invoices/:invoiceId?', (req, res) => {
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

app.post('/customers/:customerId/invoices/', (req, res) => {

  if (!req.params.customerId)
    return res.status(400).send("CustomerID hasn't been provided");

  Customer.count({ _id: req.params.customerId }).then(
    (count) => {
      if (count === 0)
        return res.status(404).send("No customer found");

      req.body.customer = req.params.customerId;

      (new Invoice(req.body))
        .save()
        .then((entity) => res.status(201).send({ id: entity._id }),
        (err) => res.status(500).send(err));

    },
    (err) => res.status(500).send(err));

});

mongoose.connect("mongodb://mongo/application", { useMongoClient: true })
  .then(() => app.listen(3000, () => { console.log("Application is ready to go!") }),
  (err) => console.error(`Error during database connection: ${err}`));
