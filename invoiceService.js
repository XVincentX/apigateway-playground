const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const apikey = require("apikey");
const axios = require("axios").default;

mongoose.Promise = global.Promise;

const app = express();
app.listen(3000, () => { console.log("Application is ready to go!") })
