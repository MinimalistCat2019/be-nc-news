const { getArticleByArticleId, getNewVoteById } = require('../models/articleModel');
const { getCommentToArticle } = require('../models/commentModel');

exports.sendArticleByArticleId = (req, res, next) => {
    // console.log('in the article controller')
    const {article_id} = req.params;
    getArticleByArticleId(article_id)
        .then((article) => {
            res.status(200).send(article[0]);
        })
        .catch(next)
//         // use the following code to check that the error message is coming through
        // .catch((err) => {
        //     console.log(err)
        //     next(err);
        // });
};

exports.sendNewVoteById = (req, res, next) => {
    const { article_id } = req.params;
    const votesBody = req.body;
    // console.log(votesAdj)
    getNewVoteById(article_id, votesBody)
        .then((article) => {
            // console.log(article)
            res.status(202).send(article);
        })
        .catch(next)
};

exports.sendCommentToArticle = (req, res, next) => {
    // console.log('in the article controller')  
    const { article_id } = req.params;
    console.log(req.params, "params")
    const tempComment = req.body;
    console.log(tempComment)
    console.log(article_id)
    getCommentToArticle(article_id, tempComment, )
        .then((comment) => {
            console.log("below is the comment ready to be sent")
            console.log(comment)
            res.status(202).send({comment});
        })
        .catch(next)
}


