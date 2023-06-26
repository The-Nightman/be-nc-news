const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`).then((data) => {
        return data.rows;
    });
};

exports.fetchArticles = (id) => {
    return db.query(`SELECT * FROM articles 
    WHERE article_id = $1;`, [id])
    .then((articleData) => {
        if (articleData.rows.length !== 1) {
            return Promise.reject({ status: 404, message: 'Article does not exist!' })
        }
        return articleData.rows
    })
}