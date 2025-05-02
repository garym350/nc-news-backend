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

    app.all("*splat", (req, res, next) => {
       res.status(404).send({status: 404, msg: "Not Found"})
      });
    
  
   
  module.exports=app;
  
  
  
  
  