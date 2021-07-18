import { renderPost } from "./module/renderPost.js"

var db = firebase.firestore()
var user = JSON.parse(localStorage.getItem('userData'))

//disable/enable post button
var postbutton = document.querySelector('.postbutton')
var postcontent = document.querySelector('.addpostcontent')

document.querySelector('.linktoprofile').innerHTML = `
    <a href='profile.html'>${user.displayName}</a>
`
postbutton.disabled = true
postcontent.onkeyup = () => {
    if (postcontent.value == '') {
        postbutton.disabled = true
    } else {
        postbutton.disabled = false
    }
}
// Add Post
function addPost() {
    db.collection("post").doc().set({
        username: user.displayName,
        userid: user.uid,
        content: postcontent.value,
        deleted: false,
        likes: 0,
        timestamp: Date()
    }).then(() => {
        console.log("Document successfully written!");
        window.location.reload()
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
};

db.collection("post").orderBy('timestamp', 'desc').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        const data = doc.data()
        renderPost(data, document.querySelector('.all_posts'))
    });
});

document.addEventListener('DOMContentLoaded', function() {
    postbutton.onclick = addPost
})