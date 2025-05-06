const {
    getEndpointDocumentation,
    fetchTopics,
    fetchArticleById,
    fetchAllArticles
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
  
  fetchAllArticles().then((articles) => {
    
    res.status(200).send({ articles })
  })
}

module.exports ={ getEndpointDocs, getTopics, getArticleById, getArticles} // export above functions for use in controller