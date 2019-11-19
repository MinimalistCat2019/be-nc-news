const topicsRouter = require('express').Router();
const { sendAllTopics } = require('../controllers/controller');

topicsRouter.route('/').get(sendAllTopics);

module.exports = topicsRouter;