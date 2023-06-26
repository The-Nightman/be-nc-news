const db = require("../db/connection");
const fs = require("fs/promises")

exports.fetchDocumentation = () => {
    return fs.readFile("./endpoints.json", "utf8", (err, data) => {
        return data
    })
    .then((data) => {
        return JSON.parse(data)
    })
}

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`).then((data) => {
        return data.rows;
    });
};
