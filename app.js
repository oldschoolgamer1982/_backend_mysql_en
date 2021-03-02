const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const Color = require('./models/Color')
const User = require('./models/User')
const Post = require('./models/Post')
const session = require('express-session')
const bcrypt = require('bcrypt')
const passport = require('passport')
require('./config/auth')(passport)

app.use(session({
    secret: 'session',
    resave: false,
    saveUnitialized: false,
    cookie: { maxAge: 30 * 60 * 1000}
}))
app.use(passport.initialize())
app.use(passport.session())
app.use((req,res,next)=>{
    res.locals.user = req.user || null
    next()
})

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.set('view engine', 'pug')

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next()
    }
    var err = [{msg: 'Please, sign in before entering this area.'}]
    res.render('home', {err: err})
}

app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/404', (req,res)=>{
    res.send('Error 404: page not found!')
})

app.get('/login', (req,res)=>{
    res.render('login')
})

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { 
        return next(err)}
        if (!user) {
            var err = []
            err.push(info)
            return res.render('login', {err: err})} 
      req.logIn(user, function(err) {
        if (err) { 
            return next(err)}
        return res.redirect('/post');
      });
    })(req, res, next);
})

app.get('/logout', (req,res)=>{
    req.logout()
    userID = undefined
    res.redirect('/')
})

app.get('/subscribe', (req,res)=>{
    res.render('subscribe')
})

app.post('/subscribe', (req,res)=>{
    var err = []
    if(!req.body.name || typeof req.body.name == undefined || req.body.name ==  null){
        err.push({msg: 'Enter a valid name!'})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email ==  null){
        err.push({msg: 'Enter a valid e-mail address!'})
    }
    if(!req.body.password || typeof req.body.password == undefined || req.body.password ==  null){
        err.push({msg: 'Enter a valid password!'})
    }
    if(req.body.password.length < 8 && req.body.password.length > 0){
        err.push({msg: 'The password must contain at least 8 characters!'})
    }
    if(req.body.password != req.body.password2){
        err.push({msg: 'Password does not match, try again!'})
    }

    if (err.length > 0){
        res.render('subscribe', {err: err})
    } else {
        bcrypt.genSalt(10, (err, salt)=>{
            User.password = req.body.password
            bcrypt.hash(User.password, salt, (err, hash)=>{
                if (err){
                    res.send('Error! ' + err)
                }
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                }).then(()=>{
                    res.redirect('/post')
                }).catch((err)=>{
                    res.send('Error! ' + err)
                })
            })
        })
    }
})

app.get('/post', isLoggedIn, (req, res)=>{
    user = userID
    Post.findAll({where: {user:user}}).then((posts)=>{
        res.render('post', {posts:posts})
    })
})

app.get('/post/add', isLoggedIn, (req,res)=>{
   res.render('postadd')
})


app.post('/post/add', (req,res)=>{
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user: userID
    }).then(()=>{
        res.redirect('/post')
    }).catch((err)=>{
        res.send('Error! ' + err)
    })
})

app.get('/color', (req, res)=>{
    Color.findAll({order: [['color', 'ASC']]}).then(function(colors){
        res.render('color', {colors: colors})}            
    )
})

app.get('/color/add', (req,res)=>{
    res.render('coloradd')
})

app.post('/color/add', function (req,res){ 
    Color.create({ 
        color: req.body.color,
        rgb: req.body.rgb,
        hex: req.body.hex
    }).then(()=>{
        res.redirect('/color')
    }).catch((err)=>{
        res.send('Error! ' + err)
    })
})

app.listen(1982, function(){
    console.log ('Connecting to URL http://localost:1982')
})
