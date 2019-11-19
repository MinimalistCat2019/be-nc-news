const { getAllTopics, getUserByUsername } = require('../models/model');

exports.sendAllTopics = (req, res, next) => {
    getAllTopics()
        .then(topics => {
            res.status(200).send({ topics });
        })
        .catch(err => next(err));
};

exports.sendUserByUsername = (req, res, next) => {
    // console.log('controller Send User')
    const { username } = req.params;
    // console.log(username)
    getUserByUsername(username)
        .then((user) => {
            res.status(200).send({ user });
        })
        .catch(err => next(err));
};