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
const {isLoggedIn} = require('./helpers/isLoggedIn')
const {isAdmin} = require('./helpers/isAdmin')
const {delPost} = require('./scripts/delPost')
const {signOut} = require('./scripts/signOut')
const {delUser} = require('./scripts/delUser')

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
        return res.redirect('/')
      })
    })(req, res, next)
})

app.get('/logout', (req,res)=>{
    res.render('confirm', {confirmedFunction: 'signOut', functionParams:req.headers.referer, confirmText: 'Are you sure you want to quit?'})  
})

app.get('/subscribe', (req,res)=>{
    res.render('subscribe')
})

app.post('/subscribe', (req,res)=>{

    User.findOne({where:{email:req.body.email}}).then((isUser)=>{
        if (isUser){
            var err = [{msg: 'Email address is already registered!'}]
            res.render('login', {err: err})
        } else {
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
                        }).then((user)=>{
                            req.login(user, (err)=>{
                                if (err) {
                                    res.send('Error! ' + err)
                                }
                                res.redirect('/post')
                            })
                        }).catch((err)=>{
                            res.send('Error! ' + err)
                        })
                    })
                })
            }
        }
    })
})

app.get('/post', isLoggedIn, (req, res)=>{
    user = userID
    Post.findAll({where: {user:user}}).then((posts)=>{
        res.render('post', {posts:posts, user:user})
    })
})

app.get('/post/add', isLoggedIn, (req,res)=>{
   res.render('postadd')
})


app.post('/post/add', (req,res)=>{
    Post.create({
        title: req.body.title,
        content: req.body.post,
        user: userID
    }).then(()=>{
        res.redirect('/post')
    }).catch((err)=>{
        res.send('Error! ' + err)
    })
})

app.get('/post/edit/:id', isLoggedIn, (req,res)=>{
    Post.findOne({where: {id: req.params.id}}).then((post)=>{
        if(post){
            if (post.user == userID) {
                res.render('editpost', {post: post})
            } else {
                var err = [{msg: 'Path/File acess error!'}]
                res.render('home', {err: err} )
            }
        } else {
            var err = [{msg: 'Path/File acess error!'}]
            res.render('home', {err: err} )
        }
    }).catch((err)=>{
        res.send('Error! ' + err)
    })
})

app.post('/post/edit/', (req,res)=>{
    Post.findOne({where: {id:req.body.postid}}).then((post)=>{
        if(post){
            post.title = req.body.title,
            post.content =  req.body.post,
            post.save().then(()=>{
                res.redirect('/post')
            })
        } else {
            var err = [{msg: 'Path/File acess error!'}]
            res.render('home', {err: err} )
        } 
    }).catch((err)=>{
        res.send('Error! ' + err)
    })
})

app.get('/post/delete/:id', isLoggedIn, (req,res)=>{
    Post.findOne({where: {id:req.params.id}}).then((post)=>{
        if(post){
            if (post.user == userID) {
                res.render('confirm', {confirmedFunction:'deletePost', functionParams:post.id, confirmText: 'Are you sure you want to permanently remove this post?'})  
            } else {
                var err = [{msg: 'Path/File acess error!'}]
                res.render('home', {err: err} )
            }
        } else {
            var err = [{msg: 'Path/File acess error!'}]
            res.render('home', {err: err} )
        }
    }).catch((err)=>{
        res.send('Error! ' + err)
    })
})

app.post('/confirm', (req,res)=>{
    isConfirmed = req.body.confirmed
    thisFunction = req.body.function
    thisParams = req.body.params
    if (isConfirmed == 'false') {
        confirmed = false
    } else {
        confirmed = true
    }
    if (thisFunction == 'deletePost') {
       delPost(req,res)
    }
    if (thisFunction == 'signOut') {
       signOut(req,res)
    }
    if (thisFunction == 'deleteUser') {
        delUser(req,res)
    }
})

app.get('/post/:userid/:id', isLoggedIn, (req,res)=>{
    if (req.params.userid == userID) {
        Post.findOne({where: {id: req.params.id}}).then((post)=>{
            if(post){
                res.render('openpost', {post: post})
            } else {
                var err = [{msg: 'Path/File acess error!'}]
                res.render('home', {err: err} )
            }
        }).catch((err)=>{
            res.send('Error! ' + err)
        })
    } else {
        var err = [{msg: 'Path/File acess error!'}]
        res.render('home', {err: err})
    }
})

app.get('/color', isLoggedIn, isAdmin, (req, res)=>{
    Color.findAll({order: [['color', 'ASC']]}).then(function(colors){
        res.render('color', {colors: colors})}            
    )
})

app.get('/color/add', isLoggedIn, isAdmin, (req,res)=>{
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

app.get('/users', isLoggedIn, isAdmin, (req,res)=>{
    User.findAll().then((users)=>{
        res.render('users',{users:users})
    })
})

app.get('/user/del/:id', isLoggedIn, isAdmin, (req,res)=>{
    User.findOne({where: {id:req.params.id}}).then((user)=>{
        if (user){
            res.render('confirm', {confirmedFunction:'deleteUser', functionParams:user.id, confirmText: 'Are you sure you want to remove this user?'})
        } else {
            var err = [{msg: 'Path/File acess error!'}]
            res.render('home', {err: err})
        }
    }).catch((err)=>{
        res.send('Error! ' + err)
    })
})

app.listen(1982, function(){
    console.log ('Connecting to URL http://localost:1982')
})
