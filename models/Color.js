const db = require('../config/db')

const Color = db.sequelize.define('colors', {
    color: {type: db.Sequel.STRING},
    rgb: {type: db.Sequel.STRING},
    hex: {type: db.Sequel.STRING}
})

module.exports = Color
