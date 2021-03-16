const Post = require('../models/Post')

module.exports ={
    delPost: function(req,res){
        Post.findOne({where: {id:thisParams}}).then((post)=>{
            if (confirmed) {
                post.destroy().then(function(){
                    res.redirect('/post')
                })
            }else {
                res.redirect(`/post/${post.user}/${post.id}`)
            }
        }).catch((err)=>{
            res.send('Error! ' + err)
        })  
    }
}