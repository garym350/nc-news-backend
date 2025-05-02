const {
    getEndpointDocs,
    getTopics,
    getArticleById,
    getArticles
    } = require("./controllers/news.controllers");
  
    const express = require("express")
    const app = express()
  
    app.get("/api", getEndpointDocs)
  
    app.get('/api/topics', getTopics)
    app.get('/api/articles', getArticles)
    app.get('/api/articles/:article_id', getArticleById)

    app.use((err, req, res, next) => {
        if (err.status) {
          res.status(err.status).send({ msg: err.msg });
        } else next(err);
      });
      
      app.use((err, req, res, next) => {
        if (err.code === "22P02") {
          res.status(400).send({ msg: "Bad Request" });
        } else next(err);
      });

    app.use((err, req, res, next) => {
        console.log(err);
        res.status(500).send({ msg: "Server Error!"});
    })

    app.all("*splat", (req, res, next) => {
       res.status(404).send({status: 404, msg: "Not Found"})
      });
    
  
   
  module.exports=app;
  
  
  
  
  