const usersRouter = require('express').Router();
const { sendUserByUsername } = require('../controllers/userController');

usersRouter.route('/:username').get(sendUserByUsername).all((req, res, next) => {
    res.status(405).send({msg: 'Method Not Allowed'});
});;

// usersRouter.use('/', () => {
//     console.log('in the users Router')
// });

module.exports = usersRouter;