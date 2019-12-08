const connection = require('../db/connection');

const getVoteForComment = (comment_id, inc_votes = 0) => {
    return connection
        .select('*')
        .from('comments')
        .where('comment_id', comment_id)
        .increment('votes', inc_votes)
        .returning('*')
        .then(comments => {
            if (comments.length < 1) {
                return Promise.reject({status: 404, msg: 'Not Found'});
            } else return comments[0];
        })
}

const deleteComment = (comment_id) => {
    return connection
        .from('comments')
        .where('comment_id', comment_id)
        .del()
        .then(comment => {
            if (comment === 0) {
                return Promise.reject({status: 404, msg: 'Not Found'})
            } else if (comment === 1) {
            return comment
            }
        })
}

module.exports = {getVoteForComment, deleteComment}