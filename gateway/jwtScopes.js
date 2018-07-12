const jwtz = require('express-jwt-authz');

const plugin = {
  version: '1.0.0',
  policies: ['apiroot'],
  init: function (pluginContext) {
    pluginContext.registerPolicy({
      name: 'jwtScopes',
      policy: (params) => (req, res, next) => jwtz(req.egContext.apiEndpoint.scopes)(req, res, next)
    })
  }
}

module.exports = plugin;
