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
    if (author) {
      return connection
        .select("username")
        .from("users")
        .where("username", author)
        .then((users) => {
          if (users.length === 0) {
            return Promise.reject({
              status: 404,
              msg: 'No such author exists'
            })
          }
        })
    }
    if (topic) {
      return connection
        .select("slug")
        .from("topics")
        .where("slug", topic)
        .then((topics) => {
          if (topics.length === 0) {
            return Promise.reject({
              status: 404,
              msg: 'No such topic exists'
            })
          }
        })
    }
    // look at this section!!!!! 
    // return connection
    // .select('*')
    // .from('articles')
    // .modify((query) => {
    //   console.log(query)
    //   if(author) query.where({author})
    //   if (topic) query.where({topic});
    // })
    
  };
  
module.exports = { checkArticle_Id_Exists, checkIfTopicOrAuthorExist} 