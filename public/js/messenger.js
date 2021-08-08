var user = JSON.parse(localStorage.getItem('userData'))
var db = firebase.firestore()
var files = []
var boxUser_Container = document.querySelector('.boxUsers-container')
var user = JSON.parse(localStorage.getItem('userData'))
var message = document.querySelector('.message')


window.onload = start()

function resolveAfter1Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 1500);
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
            if (change.type == "added" && data.docUserID !== user.uid) {
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
                    sendMessage(this.id, user, this)
                    sendMessageByEnter(this.id, user)
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
                        boxUser.querySelector('.userMessage').innerHTML = 'You:' + ' ' + objMessage.message
                    }
                    else {
                        boxUser.querySelector('.userMessage').innerHTML = objMessage.message

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

function sendMessage(receiverUid, sender, boxUser) {
    var sendingBtn = document.querySelector('.sending-btn')
    sendingBtn.onclick = function () {
        var listEmoji = document.querySelector('.list-emoji')
        listEmoji.classList.add('hide')
        if (message.value != "") {
            console.log(message.value);
            db.collection("message").doc(`${receiverUid}`).collection('message').doc(`${sender.uid}`)
                .onSnapshot((doc) => {
                    var messageData = doc.data()
                    var object = {
                        senderName: sender.displayName,
                        message: message.value,
                        senderImgURL: sender.photoURL,
                        date: Date()
                    }

                    if (messageData) {
                        // send to user doc
                        db.collection('message').doc(`${receiverUid}`).collection('message').doc(`${sender.uid}`)
                            .update({
                                message: firebase.firestore.FieldValue.arrayUnion(object)
                            })
                            .then(() => {
                                message.value = ""
                            })

                        //send to your doc
                        db.collection('message').doc(`${sender.uid}`).collection('message').doc(`${receiverUid}`)
                            .update({
                                message: firebase.firestore.FieldValue.arrayUnion(object)
                            })
                            .then(() => {
                                message.value = ""
                            })
                    }

                    else {
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
        else {
            console.log("Enter your message");
        }
    }
    renderMessage(receiverUid, sender, boxUser)
    // render2(receiverUid, sender, boxUser)
    sendEmoji()
}

function sendMessageByEnter(receiverUid, sender) {
    document.querySelector('body').onkeypress = function (e) {
        if (e.which === 13 && message.value != "") {
            var listEmoji = document.querySelector('.list-emoji')
            listEmoji.classList.add('hide')

            db.collection("message").doc(`${receiverUid}`).collection('message').doc(`${sender.uid}`)
                .onSnapshot((doc) => {
                    var messageData = doc.data()
                    var object = {
                        senderName: sender.displayName,
                        message: message.value,
                        senderImgURL: sender.photoURL,
                        date: Date()
                    }

                    if (messageData) {
                        // send to user doc
                        db.collection('message').doc(`${receiverUid}`).collection('message').doc(`${sender.uid}`)
                            .update({
                                message: firebase.firestore.FieldValue.arrayUnion(object)
                            })
                            .then(() => {
                                message.value = ""
                            })

                        //send to your doc
                        db.collection('message').doc(`${sender.uid}`).collection('message').doc(`${receiverUid}`)
                            .update({
                                message: firebase.firestore.FieldValue.arrayUnion(object)
                            })
                            .then(() => {
                                message.value = ""
                            })
                    }

                    else {
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

        else if (e.target !== listEmoji && e.target.parentElement !== listEmoji) {
            listEmoji.classList.add('hide')
        }
    }
}

function renderMessage(receiverUid, sender) {
    db.collection("message").doc(`${receiverUid}`).collection('message').doc(`${sender.uid}`)
        .onSnapshot((doc) => {
            if (doc.data()) {
                var arrayMessage = doc.data().message
                var bodyChatBox = document.querySelector('.body-chatBox')
                bodyChatBox.innerHTML = ""
                arrayMessage.map(function (objMessage) {
                    if (objMessage.senderName === sender.displayName && objMessage.message != "") {
                        var html = `
                            <div class="senderBox-right">
                                <div class="sender-message" style=" background-color: #df205c;">${objMessage.message}</div> 
                                <div class="sender-avatar">
                                    <img src="${objMessage.senderImgURL}" alt="">
                                </div>
                            </div>
                            `
                        bodyChatBox.innerHTML += html
                        bodyChatBox.scrollTop = bodyChatBox.scrollHeight;
                    }
                    else if(objMessage.senderName != sender.displayName && objMessage.message != "") {
                        var html = `
                            <div class="senderBox-left">
                                <div class="sender-avatar">
                                    <img src="${objMessage.senderImgURL}" alt="">
                                </div>
                                <div class="sender-message" style=" background-color: #3e4042;">${objMessage.message}</div>
                            </div>
                            `
                        bodyChatBox.innerHTML += html
                        bodyChatBox.scrollTop = bodyChatBox.scrollHeight;
                    }
                })
            }
        });
}

// function render2(receiverUid, sender) {
//     db.collection("message")
//         .onSnapshot(function (snapshot) {
//             console.log(snapshot.data());
//             snapshot.docChanges().forEach(function (change) {
//                 var data = change.doc.data();
//                 // if new message added
//                 if (change.type == "added") {
//                     console.log(data);
//                 }
//             })

//         })

// db.collection("message").doc(`${receiverUid}`).collection('message').doc(`${sender.uid}`)
//     .onSnapshot((snapshot) => {
//         snapshot.docChanges().forEach((change) => {
//             if (change.type === "added") {
//                 console.log("New city: ", change.doc.data());
//             }

//         });
//     });
// }

// db.collection("message").doc(`G80tzvFYmPT4XXlOQHxZWc8Y3b12`).collection('message').doc(`mUyxTolB77cmi7ItkCEUULw8hOl2`)
// db.collection("message").orderBy("date")
//     .onSnapshot(function (snapshot) {

//         snapshot.docChanges().forEach(function (change) {
//             var data = change.doc.data();
//             // if new message added
//             if (change.type == "added") {
//                 console.log(data);
//             }
//         })

//     })