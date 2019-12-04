const { getUserByUsername } = require('../models/userModel');

exports.sendUserByUsername = (req, res, next) => {
    const { username } = req.params;
    getUserByUsername(username)
        .then((user) => {
            res.status(200).send({user});
        })
        .catch(next)
};