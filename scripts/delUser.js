const User = require('../models/User')

module.exports ={
    delUser: function(req,res){
        User.findOne({where: {id:thisParams}}).then((user)=>{
            if (confirmed) {
                user.destroy().then(function(){
                    res.redirect('/users')
                })
            }else {
                res.redirect(`/users`)
            }
        }).catch((err)=>{
            res.send('Error! ' + err)
        })  
    }
}