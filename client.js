const axiosDefault = require("axios").default;
const inquirer = require("inquirer");
const pick = require("lodash.pick");
const URITemplate = require("urijs/src/URITemplate");
require('console.table');

const axios = axiosDefault.create({
  baseURL: 'http://localhost:81',
});

let serverChoices = null;

const questions = [{
  type: 'password',
  name: 'apikey',
  message: 'Please type your password',
  when: (answer) => (!axios.defaults.headers["x-apikey"])
}, {
  type: 'list',
  name: 'menu',
  message: 'What do you want to do?',
  choices: () => axios.get('/apiroot').then(res => { serverChoices = res.data.actions; return res.data.actions })
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
<<<<<<< HEAD
  name: 'customer',
=======
  name: 'customerId',
>>>>>>> Show invoices only to who has an invoice url
  choices: (answer) => {
    if (!axios.defaults.headers["x-apikey"])
      axios.defaults.headers["x-apikey"] = answer.apikey;

    return axios
      .get(serverChoices.filter((sc => sc.value === 'listCustomer'))[0].url)
<<<<<<< HEAD
      .then(response => response.data.map(customer => ({ value: customer._id, name: `${customer.name} ${customer.surname}` })))
  }

=======
      .then(response =>
        response.data
          .filter(customer => customer.invoices_url !== undefined)
          .map(customer => ({ value: { id: customer._id, invoices_url: customer.invoices_url }, name: `${customer.name} ${customer.surname}` }))
      );
  }
>>>>>>> Show invoices only to who has an invoice url
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

inquirer
  .prompt(questions)
  .then(handleAnswer)
  .catch((error) => console.error(error.response.statusText));

function handleAnswer(answer) {

  if (!axios.defaults.headers["x-apikey"])
    axios.defaults.headers["x-apikey"] = answer.apikey;

  const url = serverChoices.filter(sc => sc.value === answer.menu)[0].url;

  switch (answer.menu) {
    case 'listCustomer':
      axios
        .get(url)
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
        .post(url, pick(answer, ['name', 'surname']))
        .then((response) => {
          console.info("Customer created successfully!");
          return inquirer.prompt(questions).then(handleAnswer);
        })
        .catch((error) => console.error(error.response.statusText))
      break;
    case 'listInvoice':
      axios
        .get(URITemplate(answer.customer.invoices_url).expand({ customerId: answer.customer.id }))
        .then((response) => {
          console.log("");
          if (response.data.length === 0)
            console.log("No invoices!");
          else
            console.table(response.data.map((customer) => pick(customer, ['_id', 'date', 'amount'])));
          return inquirer.prompt(questions).then(handleAnswer);
        });
      break;
    case 'createInvoice':
      axios
        .post(URITemplate(url).expand({ customerId: answer.customerId }), pick(answer, ['date', 'amount']))
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
