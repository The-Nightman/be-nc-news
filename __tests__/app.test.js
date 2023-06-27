const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const app = require("../app")


beforeEach(() => {
    return seed(testData);
});

describe("get /api/topics", () => {
    test("returns an array of topics objects each containing a slug and description key", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.topics)).toBeTruthy();
                body.topics.forEach(item => {
                    expect(typeof item === "object").toBeTruthy();
                    expect(typeof item).not.toBeNull();
                    expect(item.hasOwnProperty("slug")).toBeTruthy();
                    expect(item.hasOwnProperty("description")).toBeTruthy();
                });
            });
    });
});

describe("get /api", () => {
    test("returns an object containing a list of available endpoints with descriptions", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                expect(typeof body.apiDoc === "object").toBeTruthy();
                expect(typeof body.apiDoc).not.toBeNull();
                expect(body.apiDoc).hasOwnProperty("GET /api");
                expect(body.apiDoc).hasOwnProperty("GET /api/topics");
                expect(body.apiDoc).hasOwnProperty("GET /api/articles");
                expect(body.apiDoc).hasOwnProperty("GET /api/articles/:article_id");
                for (let i in body.apiDoc) {
                    expect(body.apiDoc[i]).hasOwnProperty("description");
                };
            });
    });
});

describe("get /api/articles/:article_id", () => {
    test("returns an article object by id with appropriate content keys", () => {
        const articleProps = ["author",
            "title",
            "body",
            "topic",
            "created_at",
            "votes",
            "article_img_url"]
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
                expect(body.article).hasOwnProperty("article_id")
                expect(body.article.article_id).toBe(1)
                articleProps.forEach(prop => {
                    expect(body.article).hasOwnProperty(prop);
                })
            });
    });
    test("returns a status 404 error message when a valid but non-existing article id is searched", () => {
        return request(app)
            .get("/api/articles/1528")
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('Article does not exist!')
            });
    });
    test("returns a status 400 error message when an inavlid search is performed", () => {
        return request(app)
            .get("/api/articles/bad")
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('Bad request! Enter a valid ID')
            });
    });
});

describe("get /api/articles", () => {
    test("return an array of article objects with the appropriate properties without a body property", () => {
        const props = ['article_id',
            'title',
            'topic',
            'author',
            'created_at',
            'votes',
            'article_img_url',
            'comment_count']
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.articles)).toBeTruthy();
                body.articles.forEach(article => {
                    props.forEach(prop => {
                        expect(article).hasOwnProperty(prop);
                    })
                    expect(article).not.hasOwnProperty('body');
                });
            });
    });
});


afterAll(() => db.end());