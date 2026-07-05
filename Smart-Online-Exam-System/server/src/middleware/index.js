const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const registerMiddlewares = (app) => {
  //Cross-Origin Requests
  app.use(cors());
  //Security
  app.use(helmet());
  //Response Compression
  app.use(compression());
  //Cookie Parsing 
  app.use(cookieParser());
  //Body Parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  //HTTP Request Logger
  app.use(morgan("dev"));
};

module.exports = registerMiddlewares;