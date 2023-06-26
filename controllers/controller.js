const { fetchDocumentation, fetchTopics } = require("../models/model.js")

exports.endpoints = (req, res, next) => {
    fetchDocumentation().then((apiDoc) => {
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