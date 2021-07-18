var db = firebase.firestore()

function renderPost(id, data, container) {
    const html = `
    <div class='card text-white bg-dark'  style='padding: 20px;margin:20px 0px 0px 0px; text-align:left'>
        <div>
            <b>${data.username}</b> 
            <div class='dropdown dropleft' style='display: inline'>
                <a data-toggle="dropdown" style='float: right'><span class='postmenu fas fa-ellipsis-h'></span></a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item editpost" href="#" data-toggle="modal" data-target="#editpostmodal">Edit</a>
                    <a class="dropdown-item archivepost" href="#">Archive</a>
                </div>
            </div>
        </div>
        <p style='color: grey'>${data.timestamp}</p>
        <p>${data.content}</p>
        <i class="far fa-heart" style='display: inline'></i><span>${data.likes} </span>

        <div class="modal fade" id="editpostmodal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" style='color: black'>Edit post</h5>
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <textarea class='form-control editpostcontent' style='width: 100%' rows='10'>${data.content}</textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary saveeditchanges">Save changes</button>
                </div>
                </div>
            </div>
        </div>
    </div>
    `
    container.innerHTML += html

    document.querySelector('.saveeditchanges').addEventListener('click', function () {
        var change = document.querySelector('.editpostcontent').innerHTML
        console.log(change)
        if (change == data.content) {
            alert("You haven't changed anything")
        } else if (change == '') {
            alert("Your content is empty")
        }
        else {
            db.collection('post').doc(id).update({
                content: change
            })
            .then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
            window.location.reload()
        }
    })
}

export {
    renderPost
}
