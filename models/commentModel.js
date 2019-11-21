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

const getCommentsByArticleId = (article_id) => {
   return connection('comments')
      // .select('*')
      // .from('comments')
      .where({article_id: article_id})
      .returning('*')
      .then(comments => {
         // console.log(tempComments)
         // const comments = tempComments.map(tempComment => {
         // let comment = {};
         // comment.comment_id = tempComment.comment_id;
         // comment.votes = tempComment.votes;
         // comment.created_at = tempComment.created_at;
         // comment.author = tempComment.username;
         // comment.body = tempComment.body;
         // return comment
         // });
         // console.log(comments)
         return comments;
      })
}

module.exports = {getCommentToArticle, getCommentsByArticleId};