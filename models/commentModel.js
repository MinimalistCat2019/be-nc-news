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
      const numOfKeys = Object.keys(tempComment)
      // if (numOfKeys.length > 2) {
      //    return Promise.reject({
      //      status: 400,
      //      msg: `missing body`
      //    });
      //  }
      return comment[0]
   })
}


module.exports = {getCommentToArticle};