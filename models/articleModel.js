const connection = require("../db/connection");
const {
  checkArticle_Id_Exists,
  checkIfTopicOrAuthorExist
} = require("../helperFunctions");

const getArticleByArticleId = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.comment_id" })
    .where("articles.article_id", article_id)
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article exists for given article_id`
        });
      }
      return article[0];
    });
};

const getAllArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic
}) => {
  console.log("in model");
  return (
    connection
      .select("*")
      .from("articles")
      .modify(query => {
        if (author) query.where({ author });
        if (topic) query.where({ topic });
      })
      .orderBy(sort_by, order)
      // .leftJoin("comments", "articles.article_id", "comments.article_id")
      //.count({ comment_count: "comments.article_id" })
      //.groupBy("articles.article_id")
      // const doesTopicOrAuthorExist = checkIfTopicOrAuthorExist(author, topic);
      // return Promise.all([getArticles,doesTopicOrAuthorExist])
      .then(articles => {
        if (articles.length === 0) {
          if (!topic && !author) {
          return Promise.reject({
            status: 404,
            msg: "Not Found"
          });
        }
          if (topic && !author) {return articles;} 
          if (author && !topic) {return articles;}
      }   else return articles;
    })
  );
};



const getNewVoteById = (article_id, votesBody) => {
  const votesAdj = votesBody.inc_votes;
  const numOfKeys = Object.keys(votesBody);
  return connection("articles")
    .where({ article_id: article_id })
    .increment("votes", votesAdj || 0)
    .returning("*")
    .then(article => {
      if (!votesAdj && numOfKeys > 0) {
        return Promise.reject({
          status: 400,
          msg: "No votes included in body"
        });
      } else {
        if (numOfKeys.length === 0) {
          return article[0];
        }
      }
      return article[0];
    });
};

const getCommentToArticle = (article_id, tempComment) => {
  let comment = {};
  comment.author = tempComment.username;
  comment.body = tempComment.body;
  comment.article_id = article_id;

  return connection("comments")
    .where({ article_id: article_id })
    .insert(comment)
    .into("comments")
    .returning("*")
    .then(comment => {
      return comment[0];
    });
};

const getCommentsByArticleId = (article_id, userQuery) => {
  const getComments = connection("comments")
    .select("*")
    .from("comments")
    .where({ article_id: article_id })
    .orderBy(userQuery.sort_by || "created_at", userQuery.order || "desc")
    .returning("*");
  const doesArticleIdExist = checkArticle_Id_Exists(article_id);
  return Promise.all([getComments, doesArticleIdExist]).then(array => {
    return array[0];
  });
};

// const getAllArticles = (sort_by = 'created_at', order = 'desc', author, topic) => {
//   const getArticles = connection('articles')
//   .select('*')
//   .from('articles')
//   .modify()
//   }

module.exports = {
  getArticleByArticleId,
  getNewVoteById,
  getAllArticles,
  getCommentToArticle,
  getCommentsByArticleId
};
