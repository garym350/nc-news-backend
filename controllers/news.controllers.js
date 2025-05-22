const {
    getEndpointDocumentation,
    fetchTopics,
    fetchArticleById,
    fetchAllCommentsByArticleId,
    postNewComment,
    increaseArticleVotes,
    eraseComment,
    fetchAllUsers,
    fetchArticlesSorted
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

const getUsers = (req, res, next) => {

  return fetchAllUsers()
  .then((users)=>{
    res.status(200).send({ users })
  })
  .catch((err) => {
    next(err)
  })
}

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


const getCommentsByArticleId = (req, res, next) => {
    return fetchAllCommentsByArticleId(req.params.article_id)
    .then((comments) => {
      res.status(200).send({ comments })
    })
    .catch((err) => {
      next(err)
    })
} 

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  return postNewComment(article_id, username, body)
    .then((commentReturned) => {
      res.status(201).send({ comment: commentReturned });
    })
    .catch(next);
};


 const updateArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  increaseArticleVotes(article_id, inc_votes)
    .then((articleReturned) => {
      res.status(200).send({ article: articleReturned });
    })
    .catch(next);
};


  const deleteComment = (req, res, next) => {
    return eraseComment(req.params.comment_id)
    .then(()=>{
      res.status(204).send()
    })
    .catch((err)=>{
      next (err)
    })
  }

  const getArticlesSorted = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  fetchArticlesSorted(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err)=>{
      next(err)
    });
};


module.exports ={ getUsers, 
                  getEndpointDocs, 
                  getTopics, 
                  getArticleById, 
                  // getArticles, 
                  getCommentsByArticleId, 
                  postComment, 
                  updateArticleVotes, 
                  deleteComment,
                  getArticlesSorted} // export above functions for use in controller