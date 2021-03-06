var user = JSON.parse(localStorage.getItem('userData'))
var db = firebase.firestore()
var boxUser_Container = document.querySelector('.boxUsers-container')
var message = document.querySelector('.message')
var ImgName, ImgUrl;
var files = []

window.onload = start()

function resolveAfter1Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 1500);
    });
}

function resolveAfterSomeSeconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 500);
    });
}


function start() {
    async function asyncCall() {
        renderBoxUser()
        await resolveAfter1Seconds();
        renderBoxChat_main(user)
    }
    asyncCall();
}


function createBoxUser(user) {
    var html = `
    <div class="boxUser" id="${user.docUserID}">
        <div class="userAvatar">
            <img src=${user.imgURL}>
        </div>
        <div class="userInfo-container">
            <h5 class="userName">${user.name}</h5>
            <p class="userMessage"></p>
        </div>
      </div>
    `
    boxUser_Container.innerHTML += html
}

// get userInfo to render boxUser
function renderBoxUser() {
    db.collection("users").onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            var data = change.doc.data()
            if (change.type == "added" && data.docUserID != user.uid) {
                createBoxUser(data)
            }
        })
    })
}

// render user boxChat when click to boxUser
function renderBoxChat_main(user) {
    var boxesUser = document.querySelectorAll('.boxUser')
    for (var i = 0; i < boxesUser.length; i++) {
        boxesUser[i].onclick = function () {
            db.collection("message").doc(`${this.id}`).collection('message').doc(`${user.uid}`)
                .onSnapshot((doc) => {
                    if (doc.data() === undefined) {
                        var bodyChatBox = document.querySelector('.body-chatBox')
                        bodyChatBox.innerHTML = ""
                    }
                })

            db.collection("users").doc(`${this.id}`)
                .onSnapshot((doc) => {
                    var userData = doc.data()

                    renderBoxChat_heading(userData)
                    createEmptyArray(this.id, user)
                    sendMessage(this.id, user, this)
                    sendMessageByEnter(this.id, user)
                    renderMessage(this.id, user, this)
                    sendImage(this.id, user)
                });
        }

        renderBoxUserMessage(boxesUser[i], user)


    }
}

function renderBoxUserMessage(boxUser) {
    db.collection("message").doc(`${boxUser.id}`).collection('message').doc(`${user.uid}`)
        .onSnapshot((doc) => {
            if (doc.data()) {
                var messageArray = doc.data().message
                messageArray.map(function (objMessage) {
                    if (objMessage.senderName === user.displayName) {
                        if (objMessage.message) {
                            boxUser.querySelector('.userMessage').innerHTML = 'You:' + ' ' + objMessage.message
                        }
                        else if (objMessage.image) {
                            boxUser.querySelector('.userMessage').innerHTML = 'You send an image'
                        }
                    }

                    else {
                        if (objMessage.message) {
                            boxUser.querySelector('.userMessage').innerHTML = objMessage.message
                        }
                        else if (objMessage.image) {
                            boxUser.querySelector('.userMessage').innerHTML = `${objMessage.senderName} send an image`
                        }
                    }
                })
            }

        })
}

function renderBoxChat_heading(userData) {
    var headingChatBox = document.querySelector('.heading-chatBox')
    var htmls = `
        <div class="header-userImage">
            <img src=${userData.imgURL}>
        </div>
        <a><h5 class="heading-userName">${userData.name}</h5></a>
    `
    headingChatBox.innerHTML = htmls
}



// SENDING MESSAGE

function sendMessage(receiverUid, sender) {
    var sendingBtn = document.querySelector('.sending-btn')
    sendingBtn.onclick = function () {
        var listEmoji = document.querySelector('.list-emoji')
        listEmoji.classList.add('hide')

        if (message.value.trim() != "") {
            handleSendingMessage(receiverUid, sender)
        }
    }
    sendEmoji()
}

function sendMessageByEnter(receiverUid, sender) {
    document.querySelector('body').onkeypress = function (e) {
        if (e.which === 13 && message.value != "") {
            e.preventDefault();
            var listEmoji = document.querySelector('.list-emoji')
            listEmoji.classList.add('hide')

            if (message.value.trim() != "") {
                handleSendingMessage(receiverUid, sender)
            }
        }
    }
}

function createEmptyArray(receiverUid, sender) {
    // if no messageData => create empty array to save msg
    db.collection("message").doc(`${receiverUid}`).collection('message').doc(`${sender.uid}`)
        .onSnapshot((doc) => {
            var messageData = doc.data()
            if (!messageData) {
                // send to user doc
                db.collection('message').doc(`${receiverUid}`).collection('message').doc(`${sender.uid}`).set({
                    message: []
                })

                //send to your doc
                db.collection('message').doc(`${sender.uid}`).collection('message').doc(`${receiverUid}`).set({
                    message: []
                })
            }

        });
}

function handleSendingMessage(receiverUid, sender) {
    var object = {
        senderName: sender.displayName,
        message: message.value,
        senderImgURL: sender.photoURL,
        senderDate: moment().format('llll'),
    }

    db.collection('message').doc(`${receiverUid}`).collection('message').doc(`${sender.uid}`)
        .update({
            message: firebase.firestore.FieldValue.arrayUnion(object)
        })

    //send to your doc
    db.collection('message').doc(`${sender.uid}`).collection('message').doc(`${receiverUid}`)
        .update({
            message: firebase.firestore.FieldValue.arrayUnion(object)
        })
    document.querySelector('.input-container').reset()
}

function sendImage(receiverUid, sender) {
    document.querySelector('.image-icon').onclick = function () {
        var input = document.createElement('input')
        input.type = "file"
        input.onchange = e => {
            files = e.target.files
            var reader = new FileReader()

            reader.onload = function () {
                document.querySelector('.sending_img-container').classList.remove("hide")
                var imgURL = reader.result
                var img = document.getElementById('myImg')
                img.src = imgURL

                // show sending img container when select img
                document.querySelector('.sending_img-container').style.display = "block"
                handleSendingImage(img, receiverUid, sender)
            }
            reader.readAsDataURL(files[0])
        }
        input.click()
    }
}

function handleSendingImage(img, receiverUid, sender) {
    document.querySelector('.sendImg-btn').onclick = function () {
        document.querySelector('.sending_img-container').style.display = "none"

        var object = {
            senderName: sender.displayName,
            image: img.src,
            senderImgURL: sender.photoURL,
            senderDate: moment().format('llll'),
        }

        db.collection('message').doc(`${receiverUid}`).collection('message').doc(`${sender.uid}`)
            .update({
                message: firebase.firestore.FieldValue.arrayUnion(object)
            })

        //send to your doc
        db.collection('message').doc(`${sender.uid}`).collection('message').doc(`${receiverUid}`)
            .update({
                message: firebase.firestore.FieldValue.arrayUnion(object)
            })
    }
}

function sendEmoji() {
    var smilingIcon = document.querySelector('.smiling-icon')
    var emojiIcons = document.querySelectorAll('.emoji-icon')
    var listEmoji = document.querySelector('.list-emoji')

    for (var i = 0; i < emojiIcons.length; i++) {
        emojiIcons[i].onclick = function () {
            message.value += this.innerHTML
        }
    }

    document.querySelector('body').onclick = function (e) {
        if (e.target == smilingIcon) {
            listEmoji.classList.toggle('hide')
        }

        else if (e.target != listEmoji && e.target.parentElement != listEmoji) {
            listEmoji.classList.add('hide')
        }
    }
}

// RENDER MESSAGE
function renderMessage(receiverUid, sender) {
    db.collection("message").doc(`${receiverUid}`).collection('message').doc(`${sender.uid}`)
        .onSnapshot((doc) => {
            if (doc.data()) {
                var arrayMessage = doc.data().message
                var bodyChatBox = document.querySelector('.body-chatBox')

                bodyChatBox.innerHTML = ""
                arrayMessage.map(function (objMessage) {
                    if (objMessage.senderName === sender.displayName) {
                        if (objMessage.message) {
                            var html = `
                            <div class="senderBox-right">
                                <div class="sender-date">${objMessage.senderDate}</div>
                                <div class="sender-message" style="background-color: #df205c;">${objMessage.message}</div> 
                                <div class="sender-avatar">
                                    <img src="${objMessage.senderImgURL}" alt="">
                                </div>
                            </div>
                            `
                            bodyChatBox.innerHTML += html
                            bodyChatBox.scrollTop = bodyChatBox.scrollHeight;
                        }

                        else if (objMessage.image) {
                            var html = `
                            <div class="senderBox-right">
                                <div class="sender-date ">${objMessage.senderDate}</div>
                                <div class="sender-img">
                                    <img src="${objMessage.image}" class="myImg" alt="">
                                </div>
                                <div class="sender-avatar">
                                    <img src="${objMessage.senderImgURL}"alt="">
                                </div>
                            </div>
                            `
                            bodyChatBox.innerHTML += html
                            bodyChatBox.scrollTop = bodyChatBox.scrollHeight;
                        }
                    }

                    else if (objMessage.senderName != sender.displayName) {
                        if (objMessage.message) {
                            var html = `
                            <div class="senderBox-left">
                                <div class="sender-avatar">
                                    <img src="${objMessage.senderImgURL}" alt="">
                                </div>
                                <div class="sender-message" style=" background-color: #3e4042;">${objMessage.message}</div>
                                <div class="sender-date">${objMessage.senderDate}</div>
                            </div>
                            `
                            bodyChatBox.innerHTML += html
                            bodyChatBox.scrollTop = bodyChatBox.scrollHeight;
                        }

                        else if (objMessage.image) {
                            var html = `
                            <div class="senderBox-left">
                                <div class="sender-avatar">
                                    <img src="${objMessage.senderImgURL}" alt="">
                                </div>
                                <div class="sender-img">
                                    <img src="${objMessage.image}" class="myImg" alt="">
                                </div>
                            </div>
                            `
                            bodyChatBox.innerHTML += html
                            bodyChatBox.scrollTop = bodyChatBox.scrollHeight;
                        }
                    }
                })

            }

        });

    async function asyncCall() {
        await resolveAfterSomeSeconds();
        // deleting(receiverUid, sender)
        zooming()
    }
    asyncCall();
}


function zooming() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var img = document.querySelectorAll(".myImg");
    var modalImg = document.getElementById("img01");

    for (var i = 0; i < img.length; i++) {
        img[i].onclick = function () {
            modal.style.display = "block";
            modalImg.src = this.src;
        }

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }
    }

}



// DELETE MESSAGE

// function deleting(receiverUid, sender) {
//     var deleteBtns = document.querySelectorAll('.delete-btn')
//     for (var i = 0; i < deleteBtns.length; i++) {
//         deleteBtns[i].onclick = function () {
//             var deleteName = sender.displayName
//             var deleteDate = this.parentElement.querySelector('.sender-date').innerHTML
//             var deleteAvatar = this.parentElement.querySelector('img').src
//             var deleteMessage = this.parentElement.querySelector('.sender-message')
//             var deleteImg = this.parentElement.querySelector('img')
//             console.log(this);

//             // delete message
//             if (deleteMessage) {
//                 var deleteObject = {
//                     senderName: deleteName,
//                     message: deleteMessage.innerHTML,
//                     senderImgURL: deleteAvatar,
//                     senderDate: deleteDate,
//                 }

//                 handleDeleteMsg(receiverUid, sender, deleteObject);

//             }

//             // delete img
//             else if (deleteImg) {
//                 var deleteObject = {
//                     senderName: deleteName,
//                     image: deleteImg.src,
//                     senderImgURL: deleteAvatar,
//                     senderDate: deleteDate,
//                 }

//                 // db.collection('message').doc(`${receiverUid}`).collection('message').doc(`${sender.uid}`)
//                 //     .update({
//                 //         message: firebase.firestore.FieldValue.arrayRemove(deleteObject)
//                 //     })

//                 // db.collection('message').doc(`${sender.uid}`).collection('message').doc(`${receiverUid}`)
//                 //     .update({
//                 //         message: firebase.firestore.FieldValue.arrayRemove(deleteObject)
//                 //     })
//             }

//             // db.collection('message').doc(`${receiverUid}`).collection('message').doc(`${sender.uid}`)
//             //     .onSnapshot((doc) => {
//             //         console.log(doc.data().message[doc.data().message.length - 1]);
//             //         console.log(deleteObject);

//             //         console.log(doc.data().message[doc.data().message.length - 1] == deleteObject);

//             //     });
//             // .update({
//             //     message: firebase.firestore.FieldValue.arrayRemove(deleteObject)
//             // })

//             //send to your doc
//             // db.collection('message').doc(`${sender.uid}`).collection('message').doc(`${receiverUid}`)
//             //     .update({
//             //         message: firebase.firestore.FieldValue.arrayRemove(deleteObject)
//             //     })

//         }
//     }
// }



// function handleDeleteMsg(receiverUid, sender, deleteObject) {
//     db.collection('message').doc(`${receiverUid}`).collection('message').doc(`${sender.uid}`)
//         .onSnapshot((doc) => {
//             var messageArray = doc.data().message

//             messageArray.map(function (msgItem) {
//                 if (msgItem.senderName == deleteObject.senderName && msgItem.message == deleteObject.message && msgItem.senderImgURL == deleteObject.senderImgURL && msgItem.senderDate == deleteObject.senderDate) {
//                     db.collection('message').doc(`${receiverUid}`).collection('message').doc(`${sender.uid}`)
//                         .update({
//                             message: firebase.firestore.FieldValue.arrayRemove(msgItem)
//                         })

//                     db.collection('message').doc(`${sender.uid}`).collection('message').doc(`${receiverUid}`)
//                         .update({
//                             message: firebase.firestore.FieldValue.arrayRemove(msgItem)
//                         })
//                 }
//             })

//         });


// }




