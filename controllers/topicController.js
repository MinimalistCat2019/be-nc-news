const { getAllTopics } = require('../models/topicModel');

exports.sendAllTopics = (req, res, next) => {
    getAllTopics()
        .then(topics => {
            res.status(200).send({ topics });
        })
        .catch(err => next(err));
};

