import { renderPost } from "./module/renderPost.js"

var db = firebase.firestore()
var user = JSON.parse(localStorage.getItem('userData'))

//disable/enable post button
var postbutton = document.querySelector('.postbutton')
var postcontent = document.querySelector('.addpostcontent')


document.querySelector('.userava').innerHTML = `
    <img style=' border-radius: 50%' src=${user.photoURL}>
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
postbutton.onclick = function () {
    if(postcontent.value) {
        db.collection("post").doc().set({
        username: user.displayName,
        userid: user.uid,
        content: postcontent.value,
        deleted: false,
        likes: 0,
        timestamp: Date()
    }).then(() => {
        console.log("Document successfully written!");
        // window.location.reload()
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
    } else {
        alert('The content is empty')
    }
    
};

// db.collection("post").orderBy('timestamp', 'desc').get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         // console.log(`${doc.id} => ${doc.data()}`);
//         const data = doc.data()
//         if(data.deleted == false) {
//             renderPost(doc.id, data, document.querySelector('.all_posts'))
//         }
//     });
// });

db.collection("post").orderBy('timestamp', 'desc').onSnapshot((querySnapshot) => {
    document.querySelector('.all_posts').innerHTML = ''
    querySnapshot.forEach((doc) => {
        // console.log(`${doc.id} => ${doc.data()}`);
        const data = doc.data()
        if(data.deleted == false ) {
            renderPost(doc.id, data, document.querySelector('.all_posts'))
        }
    });
});

