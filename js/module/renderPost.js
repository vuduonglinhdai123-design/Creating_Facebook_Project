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
        <hr>

        <p>Comments</p>
        <div class="comment-container">
            <a class='show-comment' data-showcomment=${id}>Show comments</a>
            <div class='comment-box'></div>
        </div>

        <div class='input-group mb-3 comment-input-container'>
            <input type="text" class="form-control comment-content" placeholder="Comment here">
            <div class="input-group-append">
                <a class="btn btn-outline-secondary post-comment" type="button" data-postcomment=${id}>Comment</a>
            </div>
        </div>
    </div>
    `

    container.innerHTML += html

    // archive post
    document.querySelectorAll('.archivepost').forEach(button => {
        button.onclick = function () {
            archive(this.dataset.archive)
        }
        db.collection('post').doc(button.dataset.archive).get().then(doc => {
            if(user.uid == doc.data().userid) {
                button.style.display = 'block'
            } else button.style.display = 'none'
        })
    })

    // like post
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.onclick = function () {
            likePost(this.dataset.like)
        }
    })

    // show comments
    document.querySelectorAll('.comment-container').forEach(div => {
        var btn = div.querySelector('.show-comment')
        var commentbox = div.querySelector('.comment-box')
        btn.onclick = function () {
            showComment(this.dataset.showcomment, commentbox)
            btn.style.display = 'none'
        }
    })
    
    // display "Show comments" or not
    document.querySelectorAll('.show-comment').forEach(btn => {
        db.collection('post').doc(btn.dataset.showcomment).onSnapshot(doc => {
            if (doc.data().comments.length != 0) btn.style.display = 'block'
            else btn.style.display = 'none'
        })
    })

    // post comment
    document.querySelectorAll('.comment-input-container').forEach(div => {
        var content = div.querySelector('.comment-content')
        var btn = div.querySelector('.post-comment')
        btn.onclick = function () {
            postComment(this.dataset.postcomment, content)
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

function showComment(id, container) {
    db.collection('post').doc(id).onSnapshot(doc => {
        var comments = doc.data().comments
        comments.map(function (comment) {
            console.log(comment)
            var html = `
            <div style='margin: 5px;'>
                <div><b>${comment.username}</b></div>
                <div> ${comment.content}</div>
            </div>
            `
            container.innerHTML += html
        })
    })
}

function postComment(id, content) {
    console.log(content.value)
    if (content.value) {
        var commentObject = {
            userid: user.uid,
            username: user.displayName,
            content: content.value
        }
        db.collection('post').doc(id).update({
            comments: firebase.firestore.FieldValue.arrayUnion(commentObject)
        })
            .then(() => {
                console.log("your comment is successfully loaded")
            })
    } else {
        alert('Your comment is empty!')
    }
}
export {
    renderPost
}
