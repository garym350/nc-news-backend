const endpointsJson = require("../endpoints.json");


/* Set up your test imports here */


const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const app = require("../app");
const { forEach } = require("../db/data/test-data/articles");

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

describe("GET /api/invalidURL", () => {
  test("404: Not - found when given an invalid url", () => {
    return request(app)
      .get("/api/invalidURL")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

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

test.skip("400: Responds with bad request when given invalid path", () => {
      return request(app)
        .get("/api/articles/notANumber")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test.skip("404: Responds with custom message when given a number not in database", () => {
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
              comment_count: expect.any(String),
            });
          });
        });
    });
  });