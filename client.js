const axiosDefault = require("axios").default;
const inquirer = require("inquirer");
const pick = require("lodash.pick");
require('console.table');

const axios = axiosDefault.create({
  baseURL: 'http://localhost:81',
});

const questions = [{
  type: 'password',
  name: 'apikey',
  message: 'Please type your password',
  when: (answer) => (!axios.defaults.headers["x-apikey"])
}, {
  type: 'list',
  name: 'menu',
  message: 'What do you want to do?',
  choices: [
    { name: 'List customers', value: 'listCustomer' },
    { name: 'Create customer', value: 'createCustomer' },
    new inquirer.Separator(),
    { name: 'List invoices', value: 'listInvoice' },
    { name: 'Create new invoice', value: 'createInvoice' },
  ]
}, {
  type: 'input',
  when: (answer) => answer.menu === 'createCustomer',
  message: "Enter customer name",
  name: "name"
}, {
  type: 'input',
  when: (answer) => answer.menu === 'createCustomer',
  message: "Enter customer surname",
  name: "surname"
}, {
  type: 'list',
  when: (answer) => answer.menu === 'listInvoice' || answer.menu === 'createInvoice',
  message: 'Select a customer',
  name: 'customer',
  choices: (answer) => {
    if (!axios.defaults.headers["x-apikey"])
      axios.defaults.headers["x-apikey"] = answer.apikey;

    return axios
      .get('/customers')
      .then(response => response.data.map(customer => ({ value: { id: customer._id }, name: `${customer.name} ${customer.surname}` })))
  }
}, {
  type: 'input',
  when: (answer) => answer.menu === 'createInvoice',
  message: "Enter invoice date",
  name: "date"
}, {
  type: 'input',
  when: (answer) => answer.menu === 'createInvoice',
  message: "Enter invoice amount",
  name: "amount"
}];

const ui = new inquirer.ui.BottomBar();

inquirer
  .prompt(questions)
  .then(handleAnswer)
  .catch((error) => console.error(error.response.statusText));

function handleAnswer(answer) {

  if (!axios.defaults.headers["x-apikey"])
    axios.defaults.headers["x-apikey"] = answer.apikey;

  switch (answer.menu) {
    case 'listCustomer':
      axios
        .get('/customers')
        .then((response) => {
          console.log("");
          if (response.data.length === 0)
            console.log("No customers");
          else
            console.table(response.data.map((customer) => pick(customer, ['_id', 'name', 'surname'])));
          return inquirer.prompt(questions).then(handleAnswer);
        })
        .catch((error) => console.error(error.response.statusText))
      break;
    case 'createCustomer':
      axios
        .post('/customers', pick(answer, ['name', 'surname']))
        .then((response) => {
          console.info("Customer created successfully!");
          return inquirer.prompt(questions).then(handleAnswer);
        })
        .catch((error) => console.error(error.response.statusText))
      break;
    case 'listInvoice':
      if (answer.customer.id) {
        return axios
          .get(`/customers/${answer.customer.id}/invoices`)
          .then((response) => {
            console.log("");
            if (response.data.length === 0)
              console.log("No invoices!");
            else
              console.table(response.data.map((customer) => pick(customer, ['_id', 'date', 'amount'])));
            return inquirer.prompt(questions).then(handleAnswer);
          });
      }
      return inquirer.prompt(questions).then(handleAnswer);
      break;
    case 'createInvoice':
      axios
        .post(`/customers/${answer.customer.id}/invoices`, pick(answer, ['date', 'amount']))
        .then((response) => {
          console.info("Invoice created successfully!");
          return inquirer.prompt(questions).then(handleAnswer);
        })
        .catch((error) => console.error(error.response.statusText))
      break;
    default:
      return inquirer.prompt(questions).then(handleAnswer);
  }

}
