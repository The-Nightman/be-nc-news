const express = require("express")
const app = express()
const { endpoints, getTopics, getArticles, getArticleByID, getComments } = require("./controllers/controller")

app.get("/api", endpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleByID)

app.get("/api/articles/:article_id/comments", getComments)

app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message })
    } else {
        res.status(500).send({ message: 'internal server error' })
    }
})

module.exports = app