const apiRouter = require('express').Router();
const topicsRouter = require('./topicRouter');
const usersRouter = require('./userRouter');
const articlesRouter = require('./articleRouter');
const commentsRouter = require('./commentRouter');

// const handleMethodNotFound = require('../error-handling/index')

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

// apiRouter.all((req, res, next) => {
//     res.status(405).send({msg: 'Method Not Found'});
// });
apiRouter.route('/').all((req, res, next) => {
    res.status(405).send({msg: 'Method Not Found'});
});
// apiRouter.all(handleMethodNotFound)

module.exports = apiRouter
