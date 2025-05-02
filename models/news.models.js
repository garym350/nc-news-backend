const db = require("../db/connection");


const getEndpointDocumentation = () => {
    const docs=require("../endpoints.json")
    return Promise.resolve(docs);
  };

const fetchTopics = () => {
   
    return db.query('SELECT * FROM topics')
      .then((topics) => {
      return topics.rows
  }
   )}

const fetchArticleById = (article_id) => {
  
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]) // parameterised enquiry - not injected directly into SQL
  .then((article) => {
    const retArticle = article.rows[0]
    if (!retArticle) {
      return Promise.reject({
        status: 404,
        msg: `No articles with an ID of ${article_id}`,
      });
    }
    return article.rows[0];
  }
)}

const fetchAllArticles = () => {
  
  return db.query(`SELECT 
  articles.article_id,
  articles.author,
  articles.title,
  articles.topic,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  COUNT(comment_id) AS comment_count
FROM articles 
LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;`) 
  .then((articles) => {
    
    return articles.rows;
  }
)}

module.exports = { getEndpointDocumentation, fetchTopics, fetchArticleById, fetchAllArticles }