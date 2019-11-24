const connection = require('./db/connection');

const checkArticle_Id_Exists = (article_id) => {
    return connection
    .select('article_id')
    .from('articles')
    .where('article_id', article_id)
    .then((checking_id) => {
      if (checking_id == [])
      return 'does not'
    })
  };

module.exports = { checkArticle_Id_Exists }