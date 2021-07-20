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
                    <a type='button' class="dropdown-item archivepost"} data-archive=${id}>Archive</a>
                </div>
            </div>
        </div>
        <p style='color: grey'>${data.timestamp.toDate()}</p>
        <p>${data.content}</p>
        <a data-like=${id} class='like-btn'><i class="far fa-heart" style='display: inline'></i></a><span>${data.likes} </span>
    `

    container.innerHTML += html
    // if (data.userid != user.uid) {
    //     document.querySelector('.postmenu').style.display = 'none'
    // }

    // archive post
    document.querySelectorAll('.archivepost').forEach(button => {
        button.onclick = function () {
            archive(this.dataset.archive)
        }
    })

    // like post
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.onclick = function () {
            likePost(this.dataset.like)
        }
    })
}

function archive(id) {
    // alert('clicked')
    db.collection('post').doc(id).update({
        deleted: true
    })
        .then(() => {
            console.log("Document successfully archived!");
        })

}

function likePost(id) {
    db.collection('post').doc(id).get().then(doc => {
        var data = doc.data()
        var ref = db.collection('post').doc(id)
        var userObject = {
            userid: user.uid,
            username: user.displayName
        }
        ref.update({
            likeUsers: firebase.firestore.FieldValue.arrayUnion(userObject),
            likes: data.likes + 1
        }) 
        data.likeUsers.map(function (liker) {
            if (liker.userid == user.uid) {
                console.log(liker.userid)
                ref.update({
                    likeUsers: firebase.firestore.FieldValue.arrayRemove(userObject),
                    likes: data.likes - 1
                })
            }
        })
    })
}

export {
    renderPost
}
