const {getVoteForComment, deleteComment} = require('../models/commentModel');

exports.sendVoteToComment = (req, res, next) => {
    const {comment_id} = req.params;
    const {inc_votes }= req.body;
    getVoteForComment(comment_id, inc_votes)
        .then((comment) => {
            res.status(200).send({ comment });
        }) 
        .catch(next)
}

exports.sendCommentForDelete = (req, res, next) => {
    const { comment_id } = req.params;
    deleteComment(comment_id)
        .then(comment => {
            res.sendStatus(204);
        })
        .catch(next);
}