const {
    getEndpointDocumentation,
    fetchTopics,
    fetchArticleById,
    fetchAllArticles,
    fetchAllCommentsByArticleId,
    postNewComment
  } = require("../models/news.models.js");

const getEndpointDocs = (req, res, next) => {
    return getEndpointDocumentation().then((endpoints) => {
        res.status(200).send({ endpoints });
    });
  };

  const getTopics = (req, res, next) => {
    return fetchTopics().then((topics) => {
        res.status(200).send({ topics })
    })
    .catch(next)
  };

  const getArticleById = (req, res, next) => {
    const articleId = req.params.article_id
    return fetchArticleById(articleId)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
      next(err)
    })
  }

const getArticles = (req, res, next) => {
  return fetchAllArticles()
    .then((articles) => { 
      res.status(200).send({ articles })
    })
      .catch((err)=>{
      next(err)
    })
}

const getCommentsByArticleId = (req, res, next) => {
    fetchAllCommentsByArticleId(req.params.article_id)
    .then((comments) => {
      res.status(200).send(comments)}
    ) 
    .catch((err) => {
      next(err)
    })
} 

const postComment = (req, res, next) => {
  postNewComment(req)
    .then((commentReturned)=>{
      res.status(201).send({ comment: commentReturned })
    })
    .catch((err) => {
      next(err)
    })
  }

module.exports ={ getEndpointDocs, getTopics, getArticleById, getArticles, getCommentsByArticleId, postComment} // export above functions for use in controller