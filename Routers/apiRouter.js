const apiRouter = require('express').Router();
const topicsRouter = require('./topicRouter');
const usersRouter = require('./userRouter');
const articlesRouter = require('./articleRouter');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);


module.exports = apiRouter
