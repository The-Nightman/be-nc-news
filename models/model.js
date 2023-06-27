const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`).then((data) => {
        return data.rows;
    });
};

exports.fetchArticles = (id) => {
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

exports.fetchComments = (id) => {
    if (!/^[^A-z]+$/.test(id)) {
        return Promise.reject({ status: 400, message: 'Bad request! Enter a valid ID' })
    } else {
        return db.query(`SELECT * FROM comments 
        WHERE article_id = $1 
        ORDER BY created_at DESC;`, [id])
        .then((commentsData) => {
            if (commentsData.rows.length === 0) {
                return Promise.reject({ status: 404, message: 'Comments do not exist!' })
            }
            console.log(commentsData.rows)
            return commentsData.rows
        })
    }
}