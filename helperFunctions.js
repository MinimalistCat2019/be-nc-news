const connection = require('./db/connection');

const checkArticle_Id_Exists = (article_id) => {
    return connection
    .select('*')
    .from('articles')
    .where('article_id', article_id)
    .then((articles) => {
      if (articles.length === 0) {
        return false
      } else if(articles.length > 0) return true;
    })
  };
   
const checkIfTopicOrAuthorExist = (topic, author) => {
    if (author) {
      return connection
        .select("username")
        .from("users")
        .where("username", author);
    }
    if (topic) {
      return connection
        .select("slug")
        .from("topics")
        .where("slug", topic);
    }
  };
  
module.exports = { checkArticle_Id_Exists, checkIfTopicOrAuthorExist }