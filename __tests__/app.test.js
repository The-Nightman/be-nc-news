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
                expect(body.topics).toHaveLength(3);
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
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toHaveLength(13);
                body.articles.forEach(article => {
                    expect(typeof article.article_id).toBe('number');
                    expect(typeof article.title).toBe('string');
                    expect(typeof article.topic).toBe('string');
                    expect(typeof article.created_at).toBe('string');
                    expect(typeof article.votes).toBe('number');
                    expect(typeof article.article_img_url).toBe('string');
                    expect(typeof article.comment_count).toBe('number');
                    expect(article).not.hasOwnProperty('body');
                });
                
            });
    });
    test("return an array of article objects sorted by date descending as default", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy('created_at', {descending: true})
            });
    });
});

describe("get /api/articles/:article_id/comments", () => {
    test("returns an article object by id with appropriate content keys", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toHaveLength(11);
                body.comments.forEach(comment => {
                    expect(comment.article_id).toBe(1);
                    expect(typeof comment.comment_id).toBe('number');
                    expect(typeof comment.votes).toBe('number');
                    expect(typeof comment.created_at).toBe('string');
                    expect(typeof comment.author).toBe('string');
                    expect(typeof comment.body).toBe('string');
                })
            });
    });
    test("returns an empty array when a valid article id without comments is searched", () => {
        return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([]);
            });
    });
    test("returns a status 404 error message when a valid but non-existing article id is searched", () => {
        return request(app)
            .get("/api/articles/1635/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toEqual('Article does not exist!');
            });
    });
    test("returns a status 400 error message when an invalid search is performed", () => {
        return request(app)
            .get("/api/articles/bad/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('Bad request! Enter a valid ID');
            });
    });
});


describe("post /api/articles/:article_id/comments", () => {
    test("posts and returns a new comment to the selected article", () => {
        const testComment = { body: "test comment content",
            author: "lurker" }
        return request(app)
            .post("/api/articles/1/comments")
            .send(testComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment.article_id).toBe(1);
                expect(typeof body.comment.comment_id).toBe('number');
                expect(typeof body.comment.votes).toBe('number');
                expect(typeof body.comment.created_at).toBe('string');
                expect(typeof body.comment.author).toBe('string');
                expect(typeof body.comment.body).toBe('string');
            });
    });
    test("returns an error 404 when a valid but non-existing article id is searched", () => {
        const testComment = { body: "test comment content",
        author: "lurker" }
        return request(app)
            .post("/api/articles/1162/comments")
            .send(testComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toEqual('Article does not exist!');
            });
    });
    test("returns an error 400 if missing the author component", () => {
        const testComment = { body: "test comment content" }
        return request(app)
            .post("/api/articles/1/comments")
            .send(testComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toEqual("Author username required!");
            });
    });
    test("returns an error 400 if missing the body component", () => {
        const testComment = { author: "lurker" }
        return request(app)
            .post("/api/articles/1/comments")
            .send(testComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toEqual("Comment text required!");
            });
    });
    test("returns an error 400 when an invalid search is performed", () => {
        const testComment = { body: "test comment content",
        author: "lurker" }
        return request(app)
            .post("/api/articles/bad/comments")
            .send(testComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toEqual('Bad request! Enter a valid ID');
            });
    });
    test("returns an error 404 when an invalid username is entered", () => {
        const testComment = { body: "test comment content",
        author: "keenan" }
        return request(app)
            .post("/api/articles/1/comments")
            .send(testComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toEqual('Username does not exist!');
            });
    });
});

describe("patch /api/articles/:article_id", () => {
    test("updates the additive sum of the votes property of the chosen article by id", () => {
        const test = { inc_votes : 1 }
        return request(app)
            .patch("/api/articles/1")
            .send(test)
            .expect(200)
            .then(({ body }) => {
                expect(body.article.article_id).toBe(1);
                expect(typeof body.article.title).toBe("string");
                expect(typeof body.article.author).toBe("string");
                expect(typeof body.article.body).toBe("string");
                expect(typeof body.article.created_at).toBe("string");
                expect(body.article.votes).toBe(101);
            });
    });
    test("updates the subractive sum of the votes property of the chosen article by id", () => {
        const test = { inc_votes : -7 }
        return request(app)
            .patch("/api/articles/1")
            .send(test)
            .expect(200)
            .then(({ body }) => {
                expect(body.article.article_id).toBe(1);
                expect(typeof body.article.title).toBe("string");
                expect(typeof body.article.author).toBe("string");
                expect(typeof body.article.body).toBe("string");
                expect(typeof body.article.created_at).toBe("string");
                expect(body.article.votes).toBe(93);
            });
    });
    test("updates the article from valid keys while ignoring invalid keys", () => {
        const test = { inc_votes : 1, invalid: "false" }
        return request(app)
            .patch("/api/articles/1")
            .send(test)
            .expect(200)
            .then(({ body }) => {
                expect(body.article.article_id).toBe(1);
                expect(typeof body.article.title).toBe("string");
                expect(typeof body.article.author).toBe("string");
                expect(typeof body.article.body).toBe("string");
                expect(typeof body.article.created_at).toBe("string");
                expect(body.article.votes).toBe(101);
            });
    });
    test("returns an error 404 when a valid but non-existing article id is searched", () => {
        const test = { inc_votes : 1 }
        return request(app)
            .patch("/api/articles/1232")
            .send(test)
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('Article does not exist!');
            });
    });
    test("returns an error 400 on attempt to update an article with an invalid key", () => {
        const test = { comment_count : 1 }
        return request(app)
            .patch("/api/articles/1")
            .send(test)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('Bad request! Enter a valid key');
            });
    });
    test("returns an error 400 when an invalid search is performed", () => {
        const test = { comment_count : 1 }
        return request(app)
            .patch("/api/articles/bad")
            .send(test)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('Bad request! Enter a valid ID');
            });
    });
    test("returns an error 400 when an invalid update query is passed with a valid key", () => {
        const test = { inc_votes : "bad" }
        return request(app)
            .patch("/api/articles/1")
            .send(test)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('Bad request! Enter a valid update query');
            });
    });
});

describe("delete /api/comments/:comment_id", () => {
    test.only("returns status 204 without content and deletes comment by the given id when passed a valid id", () => {
        return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({});
                
            });
    });
    test.only("returns status 404 when given a valid but non-existing comment id", () => {
        return request(app)
            .delete("/api/comments/32")
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('Comment does not exist!');
                
            });
    });
    test.only("returns status 400 when given an invalid search is performed", () => {
        return request(app)
            .delete("/api/comments/bad")
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('Bad request! Enter a valid ID');
                
            });
    });
});

afterAll(() => db.end());
