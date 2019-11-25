const commentsRouter = require('express').Router();

const {sendVoteToComment, sendCommentForDelete} = require('../controllers/commentController');

commentsRouter.route('/:comment_id').patch(sendVoteToComment).delete(sendCommentForDelete).all((req, res, next) => {
    res.status(405).send({msg: 'Method Not Allowed'});
});;

module.exports = commentsRouter