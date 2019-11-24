const connection = require('../db/connection');

const getVoteForComment = (comment_id, inc_votes = 0) => {
    console.log('in the comments model')
    return connection
        .select('*')
        .from('comments')
        .where('comment_id', comment_id)
        .increment('votes', inc_votes)
        .returning('*')
        .then(comment => {
            if (comment.length < 1) {
                return Promise.reject({status: 404, msg: 'Not Found'});
            } else return comment;
        })
}

const deleteComment = (comment_id) => {
    return connection
        .from('comments')
        .where('comment_id', comment_id)
        .del()
        .then(comments => {
            return comments
        })
}

module.exports = {getVoteForComment, deleteComment}