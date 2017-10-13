const axiosDefault = require("axios").default;
const inquirer = require("inquirer");
const pick = require("lodash.pick");

const axios = axiosDefault.create({
  baseURL: 'http://localhost:81',
  auth: {
    username: 't',
    password: 't'
  }
});

const questions = [{
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
  name: 'customerId',
  choices: () => axios
    .get('/customers')
    .then(response => response.data.map(customer => ({ value: customer._id, name: `${customer.name} ${customer.surname}` })))
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
  .catch(console.error);

function handleAnswer(answer) {
  switch (answer.menu) {
    case 'listCustomer':
      axios
        .get('/customers')
        .then((response) => {
          console.log("");
          if (response.data.length === 0)
            console.log("No customers")
          else
            console.log(response.data.map((customer) => pick(customer, ['_id', 'name', 'surname'])));
          return inquirer.prompt(questions).then(handleAnswer);
        })
        .catch(console.err)
      break;
    case 'createCustomer':
      axios
        .post('/customers', pick(answer, ['name', 'surname']))
        .then((response) => {
          console.info("Customer created successfully!");
          return inquirer.prompt(questions).then(handleAnswer);
        })
        .catch(console.error)
      break;
    case 'listInvoice':
      axios
        .get(`/customers/${answer.customerId}/invoices`)
        .then((response) => {
          console.log("");
          if (response.data.length === 0)
            console.log("No invoices!");
          else
            console.log(response.data.map((customer) => pick(customer, ['_id', 'date', 'amount'])));
          return inquirer.prompt(questions).then(handleAnswer);
        });
      break;
    case 'createInvoice':
      axios
        .post(`/customers/${answer.customerId}/invoices`, pick(answer, ['date', 'amount']))
        .then((response) => {
          console.info("Invoice created successfully!");
          return inquirer.prompt(questions).then(handleAnswer);
        })
        .catch(console.error)
      break;
    default:
      return inquirer.prompt(questions).then(handleAnswer);
  }

}
