const commentsRouter = require('express').Router();

const {sendVoteToComment, sendCommentForDelete} = require('../controllers/commentController');

commentsRouter.route('/:comment_id').patch(sendVoteToComment).delete(sendCommentForDelete);

module.exports = commentsRouter