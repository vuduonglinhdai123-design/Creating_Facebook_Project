import { renderPost } from "./module/renderPost.js"
var db = firebase.firestore()

const user = JSON.parse(localStorage.getItem('userData'))
console.log(user)
var profilePage = document.querySelector('#userprofile')
profilePage.innerHTML = `
    <div class="avatar" style='margin: 20px'>
        <img style=' border-radius: 50%' src=${user.photoURL} width=200, height=200>
    </div>
    <h5 style='color: white'>${user.displayName}</h5>
`

db.collection('post').orderBy('timestamp', 'desc').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const data = doc.data()
        if (data.userid == user.uid) {
            console.log(data)
            renderPost(data, profilePage)
        }
        // renderPost(data.username, data.content, data.likes)
    });
});
