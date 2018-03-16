const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const apikey = require("apikey");

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

const checkRole = (roleType) => {
  const roleMap = {
    admin: 2,
    user: 1,
    anonymous: 0
  }

  return (req, res, next) => {
    if (req.user.role < roleMap[roleType])
      return res.status(401).send();
    next();
  }
}

app.use(apikey(function (key, next) {
  if (key === "adminKey")
    return next(null, { role: 2 })
  else if (key === "userKey")
    return next(null, { role: 1 })
  return next(null, { role: 0 });
}));



app.use(bodyParser.json());

app.get('/customers/:id?', checkRole('user'), (req, res) => {
  let query = {};

  if (req.params.id)
    query._id = req.params.id;

  Customer.find(query).lean()
    .then(
      (customers) => res.json(customers),
      (err) => res.status(500).send(err));
});

app.post('/customers/', checkRole('admin'), (req, res) => {
  Customer.create(req.body)
    .then(
      (entity) => res.status(201).send({ id: entity._id }),
      (err) => res.status(500).send(err));
});

app.get('/customers/:customerId/invoices/:invoiceId?', checkRole('user'), (req, res) => {
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

app.post('/customers/:customerId/invoices/', checkRole('admin'), (req, res) => {

  if (!req.params.customerId)
    return res.status(400).send("CustomerID hasn't been provided");

  Customer.count({ _id: req.params.customerId }).then(
    (count) => {
      if (count === 0)
        return res.status(404).send("No customer found");

      req.body.customer = req.params.customerId;

      Invoice.create(req.body)
        .then((entity) => res.status(201).send({ id: entity._id }),
          (err) => res.status(500).send(err));

    },
    (err) => res.status(500).send(err));

});

mongoose.connect("mongodb://mongo/application")
  .then(() => app.listen(3000, () => { console.log("Application is ready to go!") }),
    (err) => console.error(`Error during database connection: ${err}`));
