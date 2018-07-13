# API Gateway and Hypermedia

This repository is simply a set of 2 NodeJS applications that are exposing two services:
**Customers** and **Invoices** for a presentation I'm going to have soon. Video links will be posted once ready.

The idea is to show the audience how **REST** and a good **API Gateway** are perfect tools to make
your APIs really resilient and ready to change.


[Express-Gateway](https://express-gateway.io) is the API Gateway choosen here; basically because it's open source
and really spread among the community; and I work on it as fulltime job. However any other else will do the job; you
might want to check [Kong](https://getkong.org) as well.

## Installation

[Docker](https://docker.com) is used as a way to simulate different network topologies.

1. Start the system

By using Kubernetes or whatever you like

2. Insert some fixtures

```bash
curl -u t:t -X POST http://localhost/customers -H "Content-Type: application/json" -d '{"name":"Porcesco", "surname":"Gerbone"}'
curl -u t:t -X POST http://localhost/customers -H "Content-Type: application/json" -d '{"name":"Vincenzo", "surname":"Chianese"}'
```

Grab the returned ID and create some followup fake data

```bash
curl -u t:t -X POST http://localhost/customers/${customerId}/invoices -H "Content-Type: application/json" -d '{"date":"1507889426524", "amount":"150"}'
curl -u t:t -X POST http://localhost/customers/${customerId}/invoices -H "Content-Type: application/json" -d '{"date":"1507889426524", "amount":"200"}'
```

_Alternative_: `node client.js` and fill in your data directly

3. Have fun.

## Kubernetes

There's also a directory called `kubernetes` that contains a set of files to deploy the application and the dependencies
in any Kubernetes cluster. In that case, instead of `localhost`, you might need to enter the IP address assigned by
the cluster.

## Comparing the changes

You can see the changes from monolith to hypermedia and viceversa using the following Github compare links:

* https://github.com/XVincentX/apigateway-playground/compare/master...microservice
* https://github.com/XVincentX/apigateway-playground/compare/microservice...microservice-gateway-hypermedia
* https://github.com/XVincentX/apigateway-playground/compare/microservice-gateway-hypermedia...monolith-hypermedia
