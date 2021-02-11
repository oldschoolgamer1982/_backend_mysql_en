const Sequel = require('sequelize')
const sequelize = new Sequel('postapp', 'root', 'gb9913', {
    host: 'localhost',
    dialect: 'mysql'
})

sequelize.authenticate().then(function(){
    console.log ('Successfully connected to server.')
}).catch(function(err){
    console.log ('Failed to connect to server!' + err )
})

module.exports = {
    Sequel: Sequel,
    sequelize: sequelize
}