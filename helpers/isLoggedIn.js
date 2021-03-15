module.exports ={
    isLoggedIn: function(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
    var err = [{msg: 'Please, sign in before entering this area.'}]
    res.render('home', {err: err})
    }
}