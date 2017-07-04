const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose.Promise = global.Promise;

const Customer = mongoose.model('customer', {
  name: String,
  surname: String
});

const Invoice = mongoose.model('invoice', {
  date: Date,
  amount: Number,
  customer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'customer' }]
});

const app = express();

app.use(bodyParser.json());

app.get('/customers/:id', (req, res) => {
  let query = {};

  if (req.query.id)
    query._id = req.query.id;

  Customer.find(query).lean()
    .then((customers) => {
      res.json(customers);
    }).catch((err) => {
      res.status(500).send(err);
    });
});

app.post('/customer/', (req, res) => {
  const cust = new Customer(req.body);
  cust.save((entity) => {
    res.status(201).send({ id: entity._id });
  }).catch((err) => {
    res.status(500).send(err);
  });
});


mongoose.createConnection("mongodb://mongo/application", { useMongoClient: true })
  .then(() => {
    app.listen(3000, () => { console.log("Application is ready to go!"); });
  }).catch((err) => {
    console.error(`Error during database connection: ${err}`);
  });
