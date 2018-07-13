const plugin = {
  version: '1.0.0',
  policies: ['apiroot'],
  init: function (pluginContext) {
    pluginContext.registerGatewayRoute((app) => {
      app.get('/apiroot', (req, res) => res.json({
        url: '/',
        actions: [
          { url: 'http://api.apitest.lan/customers', value: 'listCustomer' },
          { url: 'http://api.apitest.lan/customers', value: 'createCustomer' },
          { url: 'http://api.apitest.lan/invoices/{customerId}/', value: 'listInvoice' },
          { url: 'http://api.apitest.lan/invoices/{customerId}/', value: 'createInvoice' },
        ]
      }));
    });
  }
}

module.exports = plugin;
