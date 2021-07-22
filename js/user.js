import { renderPost } from "./module/renderPost.js"
var db = firebase.firestore()

function renderUserProfile(id, name) {
    var profilePage = document.querySelector('.userprofile')
    var homepage = document.querySelector('.homepage')

    homepage.style.display = 'none'
    profilePage.style.display = 'block'

    profilePage.innerHTML = `
    <h5 style='color: white'>${name}</h5>
    `
    db.collection('post').orderBy('timestamp', 'desc').onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
            var data = doc.data()
            if (data.userid == id && data.deleted == false) {
                console.log(data)

                renderPost(doc.id, data, profilePage)
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
            }
        })
    })
}
// renderUserProfile('mUyxTolB77cmi7ItkCEUULw8hOl2')

export {
    renderUserProfile
}