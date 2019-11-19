exports.formatDates = articlesArray => {
    const arrayWithDatesFormatted = articlesArray.map(articleObj => {
        const formattedDate = new Date(articleObj.created_at);
        articleObj.created_at = formattedDate;
        return articleObj;
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
    if (comments.length === 0) return [];
    const formattedComments = comments.map(comment => {
        let newComment = {};
        newComment.author = comment.created_by;
        newComment.article_id = articleRef[comment.belongs_to];
        newComment.created_at = new Date(comment.created_at);
        newComment.votes = comment.votes;   
        newComment.body = comment.body;    
        return newComment;
    });
    // console.log(formattedComments)
    return formattedComments;
};
