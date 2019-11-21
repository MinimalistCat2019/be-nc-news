const { getUserByUsername } = require('../models/userModel');

exports.sendUserByUsername = (req, res, next) => {
    // console.log('in user controller')
    const { username } = req.params;
    // console.log(username)
    getUserByUsername(username)
        .then((user) => {
            res.status(200).send(user[0]);
        })
        .catch(next)
        // use the following code to check that the error message is coming through
        // .catch((err) => {
        //     console.log(err)
        //     next(err);
        // });
};