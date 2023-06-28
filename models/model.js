const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`).then((data) => {
        return data.rows;
    });
};

exports.fetchArticleByID = (id) => {
    if (!/^[^A-z]+$/.test(id)) {
        return Promise.reject({ status: 400, message: 'Bad request! Enter a valid ID' })
    } else {
        return db.query(`SELECT * FROM articles 
        WHERE article_id = $1;`, [id])
            .then((articleData) => {
                if (articleData.rows.length !== 1) {
                    return Promise.reject({ status: 404, message: 'Article does not exist!' })
                }
                return articleData.rows[0]
            })
    }
}

exports.fetchArticles = () => {
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, 
        articles.created_at, articles.votes, articles.article_img_url, 
        COUNT(comments.article_id)::INT AS comment_count FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
        GROUP BY articles.article_id ORDER BY articles.created_at DESC;`).then((data) => {
        if (data.rows.length === 0) {
            return Promise.reject({ status: 204, message: 'No Content!' })
        } else {
            return data.rows
        }
    });
};
