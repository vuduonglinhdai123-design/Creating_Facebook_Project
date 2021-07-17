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
function addpost() {
    const user = JSON.parse(localStorage.getItem('userData'))
    console.log(user.name)
    db.collection('post').doc().set({
        name: user.uid,
        content: postcontent,
        deleted: false,
        likes: 0,
        timestamp: Date()
    })
    .then(() => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}
