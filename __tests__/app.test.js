const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const app = require("../app")

beforeEach(() => {
    return seed(testData);
});

describe("get /api/topics", () => {
    test("returns an array of objects", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.topics)).toBeTruthy();
                body.topics.forEach(item => {
                    expect(typeof item === "object" && typeof item !== null).toBeTruthy();
                });
            });
    });
    test("returns an array of topics objects each containing a slug and description key", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                body.topics.forEach(item => {
                    expect(item.hasOwnProperty("slug")).toBeTruthy();
                    expect(item.hasOwnProperty("description")).toBeTruthy();
                });
            });
    });
});




afterAll(() => db.end());