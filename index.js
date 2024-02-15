require("dotenv").config();
const express = require("express");

const servidor = express();




servidor.listen(process.env.PORT);