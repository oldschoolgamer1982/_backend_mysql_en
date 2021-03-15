const localStrategy = require('passport-local')
const db = require('../config/db')
const bcrypt = require('bcrypt')
require('../models/User')
const User =  db.sequelize.define('users')



module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done)=>{
        User.findOne({where: {email:email}, attributes: ['id', 'email', 'password','name']}).then((user)=>{
            if (!user){
                return done(null, false, {msg: 'User account does not exist!'})
            } 
            bcrypt.compare(password, user.dataValues.password, (err, match)=>{
                if(match){
                    return done(null, user)
                } else {
                    return done(null, false, {msg: 'Invalid password!'})
                }
            
            })
        })
    }))

    passport.serializeUser((user, done)=>{
        userID = user.id
        userName = user.dataValues.name.split(' ')[0]
        done(null, user.id, userID, userName)
    })

    passport.deserializeUser((id, done)=>{
        User.findByPk(id).then((user, err)=>{
            done(err, user)
        })
    })
}
