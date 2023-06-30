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

exports.checkExists = (id) =>{
    return db.query(`SELECT article_id FROM articles WHERE article_id = $1;`, [id])
    .then((idExists) => {
        if (idExists.rows.length === 0) {
            return Promise.reject({ status: 404, message: 'Article does not exist!' })
        }
    })
}

exports.checkCommentExists = (id) =>{
    return db.query(`SELECT comment_id FROM comments WHERE comment_id = $1;`, [id])
    .then((commentExists) => {
        if (commentExists.rows.length === 0) {
            return Promise.reject({ status: 404, message: 'Comment does not exist!' })
        }
    })
}

exports.fetchComments = (id) => {
    if (!/^[^A-z]+$/.test(id)) {
        return Promise.reject({ status: 400, message: 'Bad request! Enter a valid ID' })
    } else {
        
        return db.query(`SELECT * FROM comments 
        WHERE article_id = $1 
        ORDER BY created_at DESC;`, [id])
        .then((commentsData) => {
            return commentsData.rows
        })
    }
}

exports.sendNewComment = (id, newComment) => {
    if (!/^[^A-z]+$/.test(id)) {
        return Promise.reject({ status: 400, message: 'Bad request! Enter a valid ID' })
    } else {
        const { body, author } = newComment
        if (!body) {
            return Promise.reject({ status: 400, message: 'Comment text required!' })
        }
        if (!author) {
            return Promise.reject({ status: 400, message: 'Author username required!' })
        }
        return db.query(`INSERT INTO comments
            (article_id, body, author)
            VALUES
            ($1, $2, $3)
            RETURNING *;`, 
            [id, body, author])
            .then((data) => {
                return data.rows[0]
            })
    }
}

exports.updateArticleByID = (id, updateData) => {
    if (!/^[^A-z]+$/.test(id)) {
        return Promise.reject({ status: 400, message: 'Bad request! Enter a valid ID' })
    } else {
        if (!Object.keys(updateData).includes('inc_votes')) {
            return Promise.reject({status: 400, message: 'Bad request! Enter a valid key'})
        } 
        const { inc_votes } = updateData
        if (!/^[^A-z]+$/.test(inc_votes)) {
            return Promise.reject({ status: 400, message: 'Bad request! Enter a valid update query' })
        }
        return db.query(`UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`, 
        [inc_votes, id])
        .then((data) => {
            return data.rows[0]
        })
    }
}

exports.deleteComment = (id) => {
    if (!/^[^A-z]+$/.test(id)) {
        return Promise.reject({ status: 400, message: 'Bad request! Enter a valid ID' })
    }
    return db.query(`DELETE FROM comments
        WHERE comment_id = $1;`, 
    [id])
}

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users;`).then((data) => {
        return data.rows
    })
}

