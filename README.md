# Kong - Node playground

This repo is simply a set of 2 NodeJS applications that are exposing a single endpoint, potentially
running on 2 different places in the world.

[Kong](https://getkong.org) is then used as a glue to serve the thing from a single endpoint and
routing to the right API.

## Installation

1. Start all the containers

`docker-compose up -d`

2. Verify Kong API is up

`curl http://localhost:8001/`

3. Create two APIs:

```bash
curl -i -X POST http://localhost:8001/apis --data "name=customers" --data "uris=/customers" --data "upstream_url=http://customers:3000"
curl -i -X POST http://localhost:8001/apis --data "name=invoices" --data "uris=/invoices" --data "upstream_url=http://invoices:3000"
```

4. Have fun.

You can eventually interact with Kong using the web interface. It will be listening on the 8080 port.
