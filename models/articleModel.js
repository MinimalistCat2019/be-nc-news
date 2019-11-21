const connection = require("../db/connection");

const getArticleByArticleId = article_id => {
  // console.log(article_id)
  return connection
    .select("*")
    .from("articles")
    .where({ article_id: article_id })
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article exists for given article_id`
        });
      }
      return article;
    });
};

const getNewVoteById = (article_id, votesAdj) => {
//   console.log(votesAdj);
//   console.log(article_id);
  return connection("articles")
    .where({ article_id: article_id })
    .increment("votes", votesAdj)
    .returning('*')
    .then(article => {
      if (!votesAdj) {
         return Promise.reject({
           status: 400,
           msg: 'No votes included in body'
         });
       } else {
         const numOfKeys = Object.keys(req.params);
         if(numOfKeys.length > 1) {
            return Promise.reject({
              status: 400,
              msg: 'Invalid property on request body'
            });
        }
       }
      return article[0];
    });
};

module.exports = { getArticleByArticleId, getNewVoteById };
