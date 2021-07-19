var db = firebase.firestore()
var user = JSON.parse(localStorage.getItem('userData'))

function renderPost(id, data, container) {
    var html = `
    <div class='card text-white bg-dark'  style='padding: 20px;margin:20px 0px 0px 0px; text-align:left'>
        <div>
            <b>${data.username}</b> 
            <div class='dropdown dropleft postmenu' style='display: inline'>
                <a data-toggle="dropdown" style='float: right'><span class='postmenu fas fa-ellipsis-h'></span></a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a type='button' class="dropdown-item archivepost${id}"}>Archive</a>
                </div>
            </div>
        </div>
        <p style='color: grey'>${data.timestamp.toDate()}</p>
        <p>${data.content}</p>
        <i class="far fa-heart like${id}" style='display: inline'></i><span>${data.likes} </span>
    `

    container.innerHTML += html
    // if (data.userid != user.uid) {
    //     document.querySelector('.postmenu').style.display = 'none'
    // }

}
function editPost(id) {
    document.querySelector(`.archivepost${id}`).onclick = function () {
        alert('clicked')
        // db.collection('post').doc(id).update({
        //     deleted: true
        // })
        //     .then(() => {
        //         console.log("Document successfully archived!");
        //     })
    }

}
export {
    renderPost,
    editPost
}
