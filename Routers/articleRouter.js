const articlesRouter = require('express').Router();

const {sendArticleByArticleId, sendNewVoteById, sendCommentToArticle, sendCommentsFromArticle, sendAllArticles} = require('../controllers/articleController');

articlesRouter.route('/').get(sendAllArticles).all((req, res, next) => {
    res.status(405).send({msg: 'Method Not Allowed'});
});;

articlesRouter.route('/:article_id').get(sendArticleByArticleId).patch(sendNewVoteById).all((req, res, next) => {
    res.status(405).send({msg: 'Method Not Allowed'});
});;

articlesRouter.route('/:article_id/comments').post(sendCommentToArticle).get(sendCommentsFromArticle).all((req, res, next) => {
    res.status(405).send({msg: 'Method Not Allowed'});
});;

module.exports = articlesRouter;