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
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
};

db.collection("post").orderBy('timestamp', 'desc').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        const data = doc.data()
        renderPost(data.username, data.content, data.likes,  document.querySelector('.all_posts'))
    });
});

function renderPost(user, content, likes) {
    const html = `<div class='card text-white bg-dark'  style='padding: 20px;margin:20px 0px 0px 0px;'>
        <h5>${user}</h5>
        <p>${content}</p>
        <i class="far fa-heart"></i><span>${likes}</span>
    </div>
    `
    document.querySelector('.all_posts').innerHTML += html
}

document.addEventListener('DOMContentLoaded', function() {
    postbutton.onclick = addPost()
})