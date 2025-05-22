const db = require("../db/connection");
const topics = require("../db/data/test-data/topics");

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

  const fetchAllArticles = () => {
  return db.query(`SELECT 
  articles.article_id,
  articles.author,
  articles.title,
  articles.topic,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  articles.body,
  COUNT(comment_id) AS comment_count
  FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`) 
  .then((articles) => {
    return articles.rows;
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

const fetchAllUsers = () => {
  return db.query(`SELECT * FROM users`)
  .then((users) => {
    return users.rows
  })
}


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

 
const postNewComment = (article_id, username, body) => {
  return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((users) => {
      if (users.rows.length === 0) {
        return Promise.reject({ status: 404, msg: `User ${username} does not exist` });
      }
      return db.query(
        `INSERT INTO comments(article_id, body, author)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [article_id, body, username]
      ).then((comments) => {
        return comments.rows[0];
      });
    })
   .catch((err) => {
    if (err.status && err.msg) {
    return Promise.reject(err);
  }

  if (err.code === "23503") {
    return Promise.reject({ status: 404, msg: `Article id ${article_id} is not valid` });
  }

  return Promise.reject({ status: 400, msg: `Bad Request` });
});
};


const increaseArticleVotes = (articleId, votes) => {
  return db.query(
    `UPDATE articles
     SET votes = votes + $2
     WHERE article_id = $1
     RETURNING *;`,
    [articleId, votes]
  )
  .then(({ rows }) => {
    const updated = rows[0];
    if (!updated) {
      return Promise.reject({ status: 404, msg: `Article with ID ${articleId} not found` });
    }
    return updated;
  });
};

const eraseComment = (commentId) => {
  return db.query(`DELETE FROM comments
                  WHERE comment_id = $1
                  RETURNING *;`,[commentId])
    .then((deletedComments)=>{
      if (deletedComments.rows.length === 0){
      return Promise.reject({ status:404, msg: `Comment with Id ${commentId} not found` }
      )}
      return;
    })
    .catch((err)=>{
      return Promise.reject(err);
    })
}

//---------------------------------------

const fetchArticlesSorted = (sort_by, order, topic) => {
  const validSortColumns = [
    "article_id",
    "title",
    "author",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "body",
  ];

  const validOrderOptions = ["asc", "desc"];

  return fetchTopics().then((topics)=>{
    const validTopics=topics.map((topics)=>topics.slug)
    
  if (!validTopics.includes(topic)) {
    topic=null}
  if (!validSortColumns.includes(sort_by)) {
    sort_by = "created_at";}
  if (!validOrderOptions.includes(order)) {
    order = "desc";}
  order=order.toUpperCase();

  const queryParams=[];

  let queryString=
      `SELECT
      articles.article_id,
      articles.author,
      articles.title,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      articles.body,
      COUNT(comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id`

    if (topic){
      queryParams.push(topic)
      queryString += ' WHERE articles.topic = $1'
    }

   queryString += `
  GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order};`

      return db.query(queryString, queryParams)

    .then((result) => {
      return result.rows;
    });
});
}

module.exports = { fetchAllUsers, 
                    eraseComment, 
                    getEndpointDocumentation, 
                    fetchTopics, 
                    fetchArticleById, 
                    fetchAllArticles, 
                    fetchAllCommentsByArticleId, 
                    postNewComment, 
                    increaseArticleVotes,
                    fetchArticlesSorted }