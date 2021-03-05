const db = require('../config/db')

const Post = db.sequelize.define('posts', {
    title: {type: db.Sequel.STRING},
    content: {type: db.Sequel.TEXT},
    user: {type: db.Sequel.INTEGER}
})

module.exports = Post