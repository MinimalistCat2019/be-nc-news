const apiRouter = require('express').Router();
const topicsRouter = require('./topicRouter');
const usersRouter = require('./userRouter');
const articlesRouter = require('./articleRouter');
const commentsRouter = require('./commentRouter');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);


module.exports = apiRouter
