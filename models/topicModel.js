const connection = require('../db/connection');

const getAllTopics = () => {
   
   return connection.select('*').from('topics');
};

const getUserByUsername = (username) => {
   console.log("in the model")
   return connection.select('*').from('users').where({username: username})
};

module.exports = { getAllTopics, getUserByUsername};