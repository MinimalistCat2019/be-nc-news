const express = require("express");
const apiRouter = require("./Routers/apiRouter");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  handleMethodNotFound
} = require("./error-handling/index");

const app = express();

app.use(express.json());

app.get('/api')

app.use("/api", apiRouter);
app.all("/*", (req, res, next) => res.status(404).send("Route not found"));
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
