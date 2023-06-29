const { fetchTopics, fetchArticles, fetchArticleByID, fetchComments, checkExists, 
    sendNewComment, updateArticleByID } = require("../models/model.js")

const fs = require("fs/promises")

exports.endpoints = (req, res, next) => {
    return fs.readFile("./endpoints.json", "utf8", (err, data) => {
        return data
    })
        .then((data) => {
            const apiDoc = JSON.parse(data)
            res.status(200).send({ apiDoc })
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

exports.getArticleByID = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleByID(article_id).then((article) => {
        res.status(200).send({ article })
    })
        .catch((err) => {
            next(err)
        })
}

exports.getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({ articles })
    })
        .catch((err) => {
            next(err)
        })
}

exports.getComments = (req, res, next) => {
    const { article_id } = req.params
    const existingArticle = checkExists(article_id)
    const commentsData = fetchComments(article_id)
    return Promise.all([existingArticle, commentsData]).then((commentsResolve) => {
        comments = commentsResolve[1]
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
    })
}

exports.postComments = (req, res, next) => {
    const { article_id } = req.params
    const newComment = req.body
    const existingArticle = checkExists(article_id)
    const newCommentData = sendNewComment(article_id, newComment)
    return Promise.all([existingArticle, newCommentData])
    .then((commentPostResolve) => {
        comment = commentPostResolve[1]
        res.status(201).send({ comment })
    })
    .catch((err) => {
        if (err.code === "23503") {
            res.status(404).send({ message: 'Username does not exist!' })
        }
        next(err)
    })
}

exports.patchArticleByID = (req, res, next) => {
    const { article_id } = req.params
    const updateData = req.body
    const existingArticle = checkExists(article_id)
    const updatedArticle = updateArticleByID(article_id, updateData)
    return Promise.all([existingArticle, updatedArticle])
    .then((articleData) => {
        article = articleData[1]
        res.status(200).send({ article })
    }).catch((err) => {
        next(err)
    })
}
    