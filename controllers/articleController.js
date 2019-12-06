const {
  getArticleByArticleId,
  getNewVoteById,
  getAllArticles,
  getCommentToArticle,
  getCommentsByArticleId
} = require("../models/articleModel");
const { checkArticle_Id_Exists } = require("../helperFunctions");

exports.sendArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  getArticleByArticleId(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.sendAllArticles = (req, res, next) => {
  console.log(req.query)
  getAllArticles(req.query)
    .then(articles => {
      console.log('back in article Controller')
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.sendNewVoteById = (req, res, next) => {
  const { article_id } = req.params;
  const inc_votes = req.body;
  getNewVoteById(article_id, inc_votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.sendCommentToArticle = (req, res, next) => {
  const { article_id } = req.params;
  const tempComment = req.body;
  getCommentToArticle(article_id, tempComment)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.sendCommentsFromArticle = (req, res, next) => {
  const { article_id } = req.params;
  const userQuery = req.query;
  getCommentsByArticleId(article_id, userQuery)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
