const express = require("express")
const app = express()
const { getTopics } = require("./controllers/controller")


app.get("/api/topics", getTopics)

app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message })
    } else {
        res.status(500).send({ message: 'internal server error' })
    }
})

module.exports = app