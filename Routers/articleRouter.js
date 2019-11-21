const articlesRouter = require('express').Router();
const {sendArticleByArticleId, sendNewVoteById} = require('../controllers/articleController');

articlesRouter.route('/:article_id').get(sendArticleByArticleId).patch(sendNewVoteById);

// articlesRouter.use('/', () => {
//     console.log('in the articles Router')
// });

module.exports = articlesRouter;