const articles = require('./articles');
const comments = require('./comments');
const topics = require('./topics');
const users = require('./users');

const data = {
    topicData: topics,
    articleData: articles,
    userData: users,
    commentData: comments
};

module.exports = data[ENV];