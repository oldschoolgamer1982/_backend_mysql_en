
module.exports ={
    signOut: function(req,res){
        if (confirmed) {
            req.logout()
            res.redirect('/')
        } else {
            res.redirect(thisParams)
        } 
    }
}