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

function checkColor(){
    var confirmColor = window.document.getElementById('color')
    if (confirmColor.value == 0){
        window.alert('Please select a Color option!')   
    } else {
        document.forms["addpost"].submit()
    }
}

function postColor(idpost){
    var postbox = window.document.getElementById(`postbox`)
    var color = window.document.getElementById(`color${idpost}`)
    postbox.style.background= color.value
}