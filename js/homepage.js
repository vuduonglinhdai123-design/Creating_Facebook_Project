// import { Post } from "./class/Post";
// import { AddPost } from "./class/AddPost";

//disable/enable post button
const postbutton = document.querySelector('.postbutton')
const postcontent = document.querySelector('.addpostcontent')
postbutton.disabled = true
postcontent.onkeyup = () => {
    if (postcontent.value == '') {
        postbutton.disabled = true
    } else {
        postbutton.disabled = false
    }
}

// Add Post
function addPost(user, content,) {
    db.collection('post').doc().set({
        name: user,
        content: content,
        deleted: false,
        likes: 0,
        timestamp: Date.now()
    })
}
