const articlesRouter = require('express').Router();

const {sendArticleByArticleId, sendNewVoteById} = require('../controllers/articleController');
const {sendCommentToArticle} = require('../controllers/articleController')

articlesRouter.route('/:article_id').get(sendArticleByArticleId).patch(sendNewVoteById)
articlesRouter.route('/:article_id/comments').post(sendCommentToArticle);

// articlesRouter.use('/', () => {
//     console.log('in the articles Router')
// });

module.exports = articlesRouter;