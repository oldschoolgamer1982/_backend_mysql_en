module.exports ={
    isAdmin: function(req,res,next){
        if(admin){
            return next()
        }
        var err = [{msg: "You don't have permission to access this area"}]
        res.render('home', {err: err})
    }
}