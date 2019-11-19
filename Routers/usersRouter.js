const usersRouter = require('express').Router();
const { sendUserByUsername } = require('../controllers/controller');

usersRouter.route('/:username').get(sendUserByUsername);

// usersRouter.use('/', () => {
//     console.log('in the users Router')
// });

module.exports = usersRouter;