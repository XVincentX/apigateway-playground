const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose.Promise = global.Promise;

const Customer = mongoose.model('customers', {
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
  Customer.create(req.body)
    .then(
    (entity) => res.status(201).send({ id: entity._id }),
    (err) => res.status(500).send(err));
});

mongoose.createConnection("mongodb://mongo/application", { useMongoClient: true })
  .then(() => app.listen(3000, () => { console.log("Application is ready to go!") }),
    (err) => console.error(`Error during database connection: ${err}`));
