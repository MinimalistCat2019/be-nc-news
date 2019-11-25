const apiRouter = require('express').Router();
const topicsRouter = require('./topicRouter');
const usersRouter = require('./userRouter');
const articlesRouter = require('./articleRouter');
const commentsRouter = require('./commentRouter');

apiRouter.use('/topics', topicsRouter).all((req, res, next) => {
    res.status(405).send({msg: 'Method Not Allowed'});
});;
apiRouter.use('/users', usersRouter).all((req, res, next) => {
    res.status(405).send({msg: 'Method Not Allowed'});
});;
apiRouter.use('/articles', articlesRouter).all((req, res, next) => {
    res.status(405).send({msg: 'Method Not Allowed'});
});;
apiRouter.use('/comments', commentsRouter).all((req, res, next) => {
    res.status(405).send({msg: 'Method Not Allowed'});
});;


module.exports = apiRouter
