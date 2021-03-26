const Sequel = require('sequelize')
const PORT = process.env.PORT || 1982

// if (process.env.NODE_ENV == 'production') {
    sequelize = new Sequel('sql10401663', 'sql10401663', 'a31UEXK56U', {
        host: "sql10.freesqldatabase.com",
        dialect: 'mysql',
        port: 3306
    })
// } else {
//     sequelize = new Sequel('database', 'username', 'password', {
//         host: 'localhost',
//         dialect: 'mysql'
//     })    
// }

sequelize.authenticate().then(function(){
    console.log ('Successfully connected to server.')
}).catch(function(err){
    console.log ('Failed to connect to server! ' + err )
})

module.exports = {
    Sequel: Sequel,
    sequelize: sequelize,
    PORT: PORT
}