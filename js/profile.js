var user = JSON.parse(localStorage.getItem('userData'))
var profilePage = document.querySelector('.userprofile')
function renderProfilePage(user) {
    profilePage.innerHTML =  `
        // <div class="userAvatar">
        //     <img src=${user.imgURL}>
        // </div>
        <h5>${user.displayName}</h5>
    `
}
renderProfilePage(user)