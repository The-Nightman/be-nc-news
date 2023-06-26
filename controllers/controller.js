const { fetchTopics, fetchArticles } = require("../models/model.js")
const fs = require("fs/promises")

exports.endpoints = (req, res, next) => {
    return fs.readFile("./endpoints.json", "utf8", (err, data) => {
        return data
    })
    .then((data) => {
        const apiDoc = JSON.parse(data)
        res.status(200).send({apiDoc})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    const { article_id } = req.params
    fetchArticles(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}
