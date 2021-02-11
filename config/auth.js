const localStrategy = require('passport-local')
const sequelize = require('sequelize')
const db = require('../config/db')
const bcrypt = require('bcrypt')


require('../models/User')
const User =  db.sequelize.define('users')


module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done)=>{
        User.findOne({email:email}).then((user)=>{
            if (!user){
                return done(null, false, {message: 'User account does not exist!'})
            }
            bcrypt.compare(password, user.password, (err, match)=>{
                if(match){
                    return done(null, user)
                } else{
                    return done(null, false, {message: 'Invalid password!'})
                }
            })
        })
    }))

    passport.serializeUser((user, done)=>{
        done(null, user.id)
    })

    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user)=>{
            done(err, user)
        })
    })
}