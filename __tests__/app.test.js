const endpointsJson = require("../endpoints.json");

/* Set up your test imports here */

const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const app = require("../app");

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((result) => { 
        const docs=result.body.endpoints
        expect(docs).toEqual(endpointsJson)
      });
  });
});

//----------------------

describe("GET /api/topics", () => {
  test("200: Responds with an array of topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBe(3);
        expect(topics).toEqual(data.topicData);
        topics.forEach((topic) => {
          expect(topic.hasOwnProperty("slug")).toBe(true);
          expect(topic.hasOwnProperty("description")).toBe(true);
        });
      });
  });
});

//--------

  describe("GET /api/articles/:article_id", () => {
    test("200: Responds with article associated with requested article ID", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 2,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });


    test("404: Responds with custom message when given a number not in database", () => {
      return request(app)
        .get("/api/articles/999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No articles with an ID of 999999");
        });
    });
  });

  describe("GET /api/articles", () => {
    test("200: Responds with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(13);
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
          body.articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            });
          });
        });
    });
  

  describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comment objects", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });

        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
});
    test("404: Responds with custom message when given a number not in database", () => {
      return request(app)
        .get("/api/articles/999999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No comments with an article Id of 999999");
        });
    });
  });


  describe("POST /api/articles/:article_id/comments", () => {
    test("Responds with the posted comment", () => {
      const commentToPost = {username: "butter_bridge", body: "This is a comment"}
      return request(app)
      .post("/api/articles/1/comments")
      .send(commentToPost)
      .expect(201)
        .then(({ body }) =>{
          expect(body.comment).toMatchObject({
            comment_id: expect.any(Number),
            article_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String)
          }
          )
        })
      })
      test("404: Responds with Bad Request Error if user is not in user database", () => {
        const commentToPost = {username: "NoName", body: "This is a comment"}
        return request(app)
          .post("/api/articles/1/comments")
          .send(commentToPost)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('User NoName does not exist');
          });
      });
      test("404: Responds with Bad Request if article number does not exist", () => {
        const commentToPost = {username: "butter_bridge", body: "This is a comment"}
        return request(app)
          .post("/api/articles/9999/comments")
          .send(commentToPost)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Article id 9999 is not valid');
          });
      });
    })

    //----- PATCH ------

    describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the article with updated votes - increase votes", () => {
    const votesUpdate = { inc_votes: 6 };
    return request(app)
      .patch("/api/articles/1")
      .send(votesUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          votes: 106,
        });
      });
  });

    test("Responds with the comment with updated votes - decrease votes", () => {
  const votesUpdate = { inc_votes: -6 };
  return request(app)
    .patch("/api/articles/1")
    .send(votesUpdate)
    .expect(200)
    .then((result) => {
      expect(result.body.article.votes).toBe(94);
    });
});
      test("404: Responds with Bad Request Error if user is not in user database", () => {
        const commentToPost = {username: "NoName", body: "This is a comment"}
        return request(app)
          .post("/api/articles/1/comments")
          .send(commentToPost)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('User NoName does not exist');
          });
      });
    })
    
    //---- DELETE

    describe("DELETE /api/comments/:comment_id", () => {
    test("Returns 202 for successful deletion", () => {
      return request(app)
      .delete("/api/comments/1")
      .expect(204)
        .then((result) =>{
          expect(result.body).toEqual({})
        })
        })

    test("404: Responds with Bad Request Error if comment is in database", () => {
      return request(app)
        .delete("/api/comments/327")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Comment with Id 327 not found');
          });
      });

    test("400: Responds with Bad Request Error if comment Id not a number", () => {
        return request(app)
          .delete("/api/comments/notanum")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
          });
      });
    })

//-------------------------------

describe("GET /api/articles(sorting queries)", () => {
  test("200: responds with an array of articles, sorted by created_at/order if no queries passed in", () =>{
    const queries={};
    return request(app)
      .get("/api/articles")
      .query(queries)
      .expect(200)
      .then(({ body })=>{
        expect(body.articles).toBeSortedBy("created_at", {descending: true} )
      })
  })

  test("200: responds with an array of articles, sorted in ascending order", () =>{
    const queries={ order: "asc" };
    return request(app)
      .get("/api/articles")
      .query(queries)
      .expect(200)
      .then(({ body })=>{ 
        expect(body.articles).toBeSortedBy("created_at", {ascending: true} )
      })
  })

  test("200: responds with an array of articles, sorted by votes in descending (default) order", () =>{
    const queries={ sort_by: "votes" };
    return request(app)
      .get("/api/articles")
      .query(queries)
      .expect(200)
      .then(({ body })=>{ 
        expect(body.articles).toBeSortedBy("votes", {descending: true} )
      })
  })
})



  
  