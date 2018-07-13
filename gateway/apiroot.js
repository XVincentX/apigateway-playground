const Client = require('kubernetes-client').Client
const config = require('kubernetes-client').config;
const JSONStream = require('JSONStream');

const client = new Client({ config: config.getInCluster(), version: '1.10' });

const avaiableActions = {
  customers: [
    { url: 'http://customers.apitest.lan/', value: 'listCustomer' },
    { url: 'http://customers.apitest.lan/', value: 'createCustomer' },
  ],
  invoices: [
    { url: 'http://invoices.apitest.lan/{customerId}/invoices/', value: 'listInvoice' },
    { url: 'http://invoices.apitest.lan/{customerId}/invoices/', value: 'createInvoice' },
  ]
};

const currentActions = JSON.parse(JSON.stringify(avaiableActions));

function onStreamData(deploymentInfo) {
  if (deploymentInfo.type === 'MODIFIED') {
    const availableReplicas = deploymentInfo.object.status.availableReplicas;
    const deploymentName = deploymentInfo.object.metadata.name;

    if (!!!availableReplicas || availableReplicas === 0) {
      console.log(`The service ${deploymentName} seems to be down. Removing affordances.`)
      currentActions[deploymentName] = [];
    }
    else {
      console.log(`The service ${deploymentName} seems to be up. Adding affordances.`)
      currentActions[deploymentName] = JSON.parse(JSON.stringify(avaiableActions[deploymentName]));
    }
  }
}

module.exports = {
  version: '1.0.0',
  policies: ['apiroot'],
  init: function (pluginContext) {

    const namespace = client.apis.apps.v1.watch.namespaces('default');
    const customers = namespace.deployments('customers');
    const invoices = namespace.deployments('invoices');

    const streams = [customers.getStream().pipe(JSONStream.parse()), invoices.getStream().pipe(JSONStream.parse())]

    streams.forEach((stream) => stream.on('data', onStreamData));

    pluginContext.registerGatewayRoute((app) => {
      app.get('/apiroot', (req, res) => res.json({
        url: '/',
        actions: [...currentActions.customers, ...currentActions.invoices]
      }));
    });
  }
}
