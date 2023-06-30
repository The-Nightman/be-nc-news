const express = require("express")
const app = express()
const { endpoints, getTopics, getArticles, getArticleByID, getComments, 
    postComments, patchArticleByID, deleteCommentByID } = require("./controllers/controller")

app.use(express.json())

app.get("/api", endpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleByID)

app.get("/api/articles/:article_id/comments", getComments)

app.post("/api/articles/:article_id/comments", postComments)

app.patch("/api/articles/:article_id", patchArticleByID)

app.delete("/api/comments/:comment_id", deleteCommentByID)

app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message })
    } else {
        res.status(500).send({ message: 'internal server error' })
    }
})

module.exports = app
