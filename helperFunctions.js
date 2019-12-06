const connection = require('./db/connection');

const checkArticle_Id_Exists = (article_id) => {
    return connection
    .select('*')
    .from('articles')
    .where('article_id', article_id)
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article exists for given article_id`
        }) 
      } else return articles;
    })
  }

const checkIfTopicOrAuthorExist = ({author, topic}) => {
  let doesAuthorExist;
  let doesTopicExist;
    if (author) {
       doesAuthorExist = connection
        .select("username")
        .from("users")
        .where("username", author)
        .then((users) => {
          if (users.length === 0) {
            return Promise.reject({
              status: 404,
              msg: 'No such author exists'
            });
          }
        });
    }

    if (topic) {
      doesTopicExist = connection
        .select("slug")
        .from("topics")
        .where("slug", topic)
        .then((topics) => {
          if (topics.length === 0) {
            return Promise.reject({
            status: 404,
            msg: 'No such topic exists'
          });
        }
      });
    }
  
   return Promise.all([doesAuthorExist, doesTopicExist]);
  };
  
module.exports = { checkArticle_Id_Exists, checkIfTopicOrAuthorExist} 