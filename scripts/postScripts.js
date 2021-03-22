var allPosts = window.document.getElementsByName('id')

for (postID of allPosts){
    changeColor(postID.value)
}

function openPost(user, id){
    window.location.href = `/post/${user}/${id}`
}
        
function changeColor(idpost){
    var titlebox = window.document.getElementsByName(`post${idpost}`)[0]
    var color = window.document.getElementById(`color${idpost}`)
    titlebox.style.background= color.value
}
