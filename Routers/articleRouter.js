const articlesRouter = require('express').Router();

const {sendArticleByArticleId, sendNewVoteById, sendCommentToArticle, sendCommentsFromArticle, sendAllArticles} = require('../controllers/articleController');

articlesRouter.route('/').get(sendAllArticles);

articlesRouter.route('/:article_id').get(sendArticleByArticleId).patch(sendNewVoteById);

articlesRouter.route('/:article_id/comments').post(sendCommentToArticle).get(sendCommentsFromArticle);

// articlesRouter.use('/', () => {
//     console.log('in the articles Router')
// });

module.exports = articlesRouter;