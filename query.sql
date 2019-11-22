\c nc_news_test
SELECT * FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id;