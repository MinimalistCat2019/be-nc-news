const connection = require("../db/connection");
const {
  checkArticle_Id_Exists,
  checkIfTopicOrAuthorExist
} = require("../helperFunctions");

const getAllArticles = ({
    sort_by = "created_at",
  order = "desc",
  author,
  topic
}) => {
    checkIfTopicOrAuthorExist({author, topic})
    return connection
    .select('*')
    .from('articles')
    .orderBy(sort_by, order)
    .modify(query => {
        if (topic !== undefined) query.where(topic !== undefined)
        if  ( )
    })
  

}

const selectFilms = (sort_by = 'title', order = 'asc')