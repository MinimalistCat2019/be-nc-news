const connection = require('../db/connection');

const getUserByUsername = (username) => {
   // console.log("in the userModel")
   return connection.select('*').from('users').where({username: username})
   .then(user => {
      if (user.length === 0) {
            return Promise.reject({
               status: 404,
               msg: `No user found for username: ${username}`
         });
      } return user;
   })
   
};

module.exports = {getUserByUsername};