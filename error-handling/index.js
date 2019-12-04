
exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) res.status(err.status).send({ msg: err.msg });
    else next(err);
};
exports.handlePsqlErrors = (err, req, res, next) => {

  const psqlBadRequestCodes = {
    "22P02": {status: 400, msg: "Bad Request"}, 
    "23502": {status: 400, msg: "Bad Request"},
    "23503": {status: 404, msg: "Not Found"},
    "42601": {status: 400, msg: "Bad Request"}
  }
  const incomingError = psqlBadRequestCodes[err.code];

  if (incomingError) {
    res.status(incomingError.status).send({ msg: incomingError.msg
    });
  }
  else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};