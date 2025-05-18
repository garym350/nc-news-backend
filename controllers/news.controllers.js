const {
    getEndpointDocumentation,
    fetchTopics,
    fetchArticleById,
    fetchAllArticles,
    fetchAllCommentsByArticleId,
    postNewComment,
    increaseArticleVotes,
    eraseComment
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

  const updateArticleVotes = (req, res, next) => {
    const article_id = req.params.article_id;
    increaseArticleVotes(article_id, req.body.inc_votes)
    .then((articleReturned)=>{
      res.status(200).send({articleReturned})
    })
    .catch((err)=>{
      next (err)
    })
  }

  const deleteComment = (req, res, next) => {
    console.log("controller entered")
    eraseComment(req.params.comment_id)
    .then((ret)=>{
      res.status(204).send()
    })
    .catch((err)=>{
      next (err)
    })

  }

module.exports ={ getEndpointDocs, getTopics, getArticleById, getArticles, getCommentsByArticleId, postComment, updateArticleVotes, deleteComment} // export above functions for use in controller