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
                    expect(typeof item === "object" && typeof item !== null).toBeTruthy();
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
                expect(typeof body.apiDoc === "object" && typeof body.apiDoc !== null).toBeTruthy();
                expect(body.apiDoc).toHaveProperty("GET /api");
                expect(body.apiDoc).toHaveProperty("GET /api/topics");
                expect(body.apiDoc).toHaveProperty("GET /api/articles");
                for (let i in body.apiDoc) {
                    expect(body.apiDoc[i]).toHaveProperty("description");
                };
            });
    });
});



afterAll(() => db.end());