const db = require('../config/db')

const User = db.sequelize.define('users', {
    name: {type: db.Sequel.STRING},
    email: {type: db.Sequel.STRING},
    password: {type: db.Sequel.STRING},
    isAdmin: {type: db.Sequel.INTEGER, defaultValue: 0}
})

module.exports = User
