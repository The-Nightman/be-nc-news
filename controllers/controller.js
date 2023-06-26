const { fetchTopics } = require("../models/model.js")

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        //console.log(res.topics)
        res.status(200).send({ topics })
    })
        .catch((err) => {
            next(err)
        })
}