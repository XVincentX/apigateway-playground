const axiosDefault = require("axios").default;
const inquirer = require("inquirer");
const pick = require("lodash.pick");
const URITemplate = require("urijs/src/URITemplate");
require('console.table');

const axios = axiosDefault.create({
  baseURL: 'http://api.apitest.lan',
});

let serverChoices = null;

const questions = [{
  type: 'input',
  name: 'username',
  message: 'Please type your username',
  when: (answer) => (!axios.defaults.headers["Authorization"])
}, {
  type: 'password',
  name: 'password',
  message: 'Please type your password',
  when: (answer) => (!axios.defaults.headers["Authorization"])
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
  name: 'customer',
  choices: (answer) => {
    return fetchToken({ username: answer.username, password: answer.password }).then(() => {
      return axios
        .get(serverChoices.filter((sc => sc.value === 'listCustomer'))[0].url)
        .then(response =>
          response.data
            .filter(customer => customer.invoices_url !== undefined)
            .map(customer => ({ value: { id: customer._id, invoices_url: customer.invoices_url }, name: `${customer.name} ${customer.surname}` }))
        );
    })
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

inquirer
  .prompt(questions)
  .then(handleAnswer)
  .catch((error) => console.error(error.response ? error.response.statusText : error));

function fetchToken({ username, password }) {
  if (!axios.defaults.headers["Authorization"]) {
    return axios.post('https://express-gateway.auth0.com/oauth/token',
      {
        "grant_type": "password",
        "username": username,
        "password": password,
        "audience": "https://api.apitest.lan",
        "client_id": "CHTKiv5U8NU7PYmPQ3QZwfc98XDWwsZ7"
      }
    ).then((response) => {
      axios.defaults.headers["Authorization"] = `Bearer ${response.data.access_token}`;
    })
  }
  else {
    return Promise.resolve();
  }

}

function handleAnswer(answer) {

  fetchToken({ username: answer.username, password: answer.password }).then(() => {
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
          .catch((error) => console.error(error.response ? error.response.statusText : error))
        break;
      case 'createCustomer':
        axios
          .post(url, pick(answer, ['name', 'surname']))
          .then((response) => {
            console.info("Customer created successfully!");
            return inquirer.prompt(questions).then(handleAnswer);
          })
          .catch((error) => console.error(error.response ? error.response.statusText : error))
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
          .post(URITemplate(url).expand({ customerId: answer.customer.id }), pick(answer, ['date', 'amount']))
          .then((response) => {
            console.info("Invoice created successfully!");
            return inquirer.prompt(questions).then(handleAnswer);
          })
          .catch((error) => console.error(error.response ? error.response.statusText : error))
        break;
      default:
        return inquirer.prompt(questions).then(handleAnswer);
    }
  })
}
