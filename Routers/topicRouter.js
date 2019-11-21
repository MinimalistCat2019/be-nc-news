const topicsRouter = require('express').Router();
const { sendAllTopics } = require('../controllers/topicController');

topicsRouter.route('/').get(sendAllTopics);

module.exports = topicsRouter;