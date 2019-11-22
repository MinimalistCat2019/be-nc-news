const connection = require('../db/connection');

const getCommentToArticle = (article_id, tempComment) => {
   // console.log("in the commentModel")
  
   let comment = {};
   comment.author = tempComment.username;
   comment.body = tempComment.body;
   comment.article_id = article_id;
   // console.log(comment.body)

   return connection('comments')
   .where({ article_id: article_id })
   .insert(comment)
   .into('comments')
   .returning('*')
   .then(comment => {
      return comment[0];
   })
}

const getCommentsByArticleId = (article_id, userQuery) => {
   return connection('comments')
      .select('*')
      .from('comments')
      .where({article_id: article_id})
      .orderBy(userQuery.sort_by || 'created_at', userQuery.order || 'desc')
      .returning('*')
      .then(comments => {
         console.log('in the model')
        if (comments.length === 0) {
            return Promise.reject({
               status: 404,
               msg: `No article exists for given article_id`
            })
         };
            return comments
      })
}

module.exports = {getCommentToArticle, getCommentsByArticleId};