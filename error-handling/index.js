// exports.handleCustomErrors = (err, req, res, next) => {
//     if (err.status) res.status(err.status).send({ msg: err.msg });
//     else next(err);
//   };
const express = require('express');

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) res.status(err.status).send({ msg: err.msg });
    else next(err);
};
exports.handlePsqlErrors = (err, req, res, next) => {

  const psqlBadRequestCodes = ['22P02', '22003'];
  if (psqlBadRequestCodes.includes(err.code)) {
    res.status(400).send({ msg: 'Bad Request' });
  }
  else next(err);
};
exports.handleServerErrors = (err, req, res, next) => {
  console.log(err)
  res.status(500).send({ msg: 'Internal Server Error' });
};