const {
    getEndpointDocs,
    getTopics,
    getArticleById,
    getArticles, 
    getCommentsByArticleId,
    postComment,
    updateArticleVotes,
    deleteComment,
    getUsers, 
    getArticlesSorted

    } = require("./controllers/news.controllers");
  
    const express = require("express")
    const app = express()
    app.use(express.json());
  
    app.get("/api", getEndpointDocs)
    app.get('/api/topics', getTopics)
    app.get('api/users', getUsers)
    app.get('/api/articles/:article_id', getArticleById)
    app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
    app.post('/api/articles/:article_id/comments', postComment)
    app.patch('/api/articles/:article_id', updateArticleVotes)
    app.delete('/api/comments/:comment_id', deleteComment)
    app.get('/api/articles', getArticlesSorted)


    app.use((err, req, res, next) => {
        if (err.status) {
          res.status(err.status).send({ msg: err.msg });
        } else next(err);
      });
      
      app.use((err, req, res, next) => {
        if (err.code === "22P02" || err.code === "23503") {
          res.status(400).send({ msg: "Bad Request" });
        } else next(err);
      });

    app.use((err, req, res, next) => {
        res.status(500).send({ msg: "Server Error!"});
    })

    app.all("*splat", (req, res, next) => {
       res.status(404).send({status: 404, msg: "Not Found"})
      });
    
  module.exports=app;
  