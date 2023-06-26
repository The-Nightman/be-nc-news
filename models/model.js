const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`).then((data) => {
        console.log(data.rows)
        return data.rows;
    });
};
