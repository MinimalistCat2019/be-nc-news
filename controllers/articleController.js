const { getArticleByArticleId, getNewVoteById } = require('../models/articleModel');

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
    const { article_id } = req.params
    const votesAdj = req.body.inc_votes
    // console.log(votesAdj)
    getNewVoteById(article_id, votesAdj)
        .then((article) => {
            // console.log(article)
            res.status(202).send(article);
        })
        .catch(next)
};



