const {getVoteForComment, deleteComment} = require('../models/commentModel');

exports.sendVoteToComment = (req, res, next) => {
    const {comment_id} = req.params;
    const {inc_votes }= req.body;
    getVoteForComment(comment_id, inc_votes)
        .then((response) => {
            comment = response;
            console.log(comment)
            res.status(200).send({ comment });
        }) 
        .catch(next)
}

exports.sendCommentForDelete = (req, res, next) => {
    const { comment_id } = req.params;
    console.log(comment_id)
    deleteComment(comment_id)
        .then(commentIdFound => {
            console.log(commentIdFound)
            if (commentIdFound === 0) {
                res.status(404).send({msg: 'Not Found'})
            } else if (commentIdFound === 1) {
                res.sendStatus(204);
            }
        })
        .catch(next);
}