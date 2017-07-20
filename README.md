# Kong and Hypermedia

This repository is simply a set of 2 NodeJS applications that are exposing two services:
**Customers** and **Invoices**

The idea is to show the audience how **REST** and a good **API Gateway** are perfect tools to make
your APIs really resilient and ready to change.

[Kong](https://getkong.org) is the API Gateway choosen here; basically because it's open source
and really spread among the community; however any other else will do the job.

## Installation

[Docker](https://docker.com) is used as a way to simulate different network topologies.

1. Start all the containers

`docker-compose up -d`

2. Verify Kong API is up

`curl http://localhost:8001/`

3. Create two APIs:

```bash
curl -i -X POST http://localhost:8001/apis --data "name=customers" --data "uris=/customers" --data "upstream_url=http://customers:3000"
curl -i -X POST http://localhost:8001/apis --data "name=invoices" --data "uris=/invoices" --data "upstream_url=http://invoices:3000"
```

4. Insert some fixtures

```bash
curl -X POST http://customers.apitest.lan/customers -H "Content-Type: application/json" -d '{"name":"Porcesco", "surname":"Gerbone"}'
curl -X POST http://customers.apitest.lan/customers -H "Content-Type: application/json" -d '{"name":"Vincenzo", "surname":"Chianese"}'
```

5. Have fun.

You can eventually interact with Kong using the web interface. It will be listening on the 8080 port.
