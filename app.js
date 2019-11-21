const express = require("express");
const apiRouter = require("./Routers/apiRouter");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors
} = require("./error-handling/index");

const app = express();

app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", (req, res, next) => res.status(400).send("Bad Request"));
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
