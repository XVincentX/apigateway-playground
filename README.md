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

1. Start all the containers

`docker-compose up -d`

2. Insert some fixtures

```bash
curl -X POST http://customers.apitest.lan/customers -H "Content-Type: application/json" -d '{"name":"Porcesco", "surname":"Gerbone"}'
curl -X POST http://customers.apitest.lan/customers -H "Content-Type: application/json" -d '{"name":"Vincenzo", "surname":"Chianese"}'
```

3. Have fun.
