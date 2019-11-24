exports.formatDates = articlesArray => {
    const arrayWithDatesFormatted = articlesArray.map(articleObj => {
        const newArticleObj = {...articleObj}
        const formattedDate = new Date(articleObj.created_at);
        newArticleObj.created_at = formattedDate;

        return newArticleObj;
    }); 
    // console.log(arrayWithDatesFormatted);
    return arrayWithDatesFormatted;
};

exports.makeRefObj = list => {
    let refObj = {};
    list.forEach(article => {
        refObj[article.title] = article.article_id;
    });
    return refObj;
};

exports.formatComments = (comments, articleRef) => {
    const formattedComments = comments.map(comment => {
        let newComment = {};
        newComment.author = comment.created_by;
        newComment.article_id = articleRef[comment.belongs_to];
        newComment.created_at = new Date(comment.created_at);
        newComment.votes = comment.votes;   
        newComment.body = comment.body;    
        return newComment;
    });
    return formattedComments;
};
