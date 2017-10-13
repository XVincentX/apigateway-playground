const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const apikey = require("apikey");

mongoose.Promise = global.Promise;

const Customer = mongoose.model('customers', {
  name: String,
  surname: String
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

app.get('/:id?', checkRole('user'), (req, res) => {
  let query = {};

  if (req.params.id)
    query._id = req.params.id;

  Customer.find(query).lean()
    .then(
    (customers) => res.json(customers),
    (err) => res.status(500).send(err));
});

app.post('/', checkRole('admin'), (req, res) => {
  (new Customer(req.body))
    .save()
    .then(
    (entity) => res.status(201).send({ id: entity._id }),
    (err) => res.status(500).send(err));
});

mongoose.connect("mongodb://mongo/application", { useMongoClient: true })
  .then(() => app.listen(3000, () => { console.log("Application is ready to go!") }),
  (err) => console.error(`Error during database connection: ${err}`));
