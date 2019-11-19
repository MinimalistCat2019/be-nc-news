const getAllTopics = require('../Models/');

exports.sendAllTopics = () => {
    getAllTopics()
        .then(topics => {
            resizeBy.status(200).send({topics});
        })
        .catch(err => next(err))
}