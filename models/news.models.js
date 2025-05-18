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

const fetchAllCommentsByArticleId = (article_id) => {
  return db.query(`SELECT
    comment_id,
    votes,
    created_at,
    author,
    body,
    article_id
    FROM comments WHERE article_id = $1
    ORDER BY created_at DESC`,[article_id])
    .then((comments)=>{
      if (comments.rows.length === 0){
        return Promise.reject({status:404, msg: `No comments with an article Id of ${article_id}`})
      }
      return comments.rows;
      })
}

 
const postNewComment = (req) => {
  const article_id = req.params.article_id
  const userName = req.body.username
  const commentBody = req.body.body

return db.query(`SELECT * FROM users WHERE username = $1`, [userName])
.then((users) => {
  if(users.rows.length === 0){
    return Promise.reject( {status:404, msg: `User ${userName} does not exist`})
  }

  return db.query(`INSERT INTO comments(article_id, body, author)
    VALUES ($1, $2, $3)
    RETURNING *`, [article_id, commentBody, userName])
  .then((comments)=>{
    return comments.rows[0]
  })
  .catch((err)=>{
    if(err.code === "23503"){
      return Promise.reject( {status: 404, msg: `Article id ${article_id} is not valid`})
    }
      return Promise.reject({ status: 404, msg: `Bad Request`})
    })
  })
}

const increaseArticleVotes = (articleId, votes) =>{
  return db.query(`UPDATE articles
                    SET votes = votes + $2
                    WHERE article_id = $1
                    RETURNING *;`,[articleId, votes])
    .then((article)=>{
      return article.rows[0];
    })
    .catch((err)=>{
      return Promise.reject( { status: 404, msg: 'Article votes not updated'})
    })
}

module.exports = { getEndpointDocumentation, fetchTopics, fetchArticleById, fetchAllArticles, fetchAllCommentsByArticleId, postNewComment, increaseArticleVotes }