var db = firebase.firestore()
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
        renderUserBox()
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
function renderUserBox() {
    db.collection("users").onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {

            var data = change.doc.data()
            if (change.type == "added") {
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
            db.collection("users").doc(`${this.id}`)
                .onSnapshot((doc) => {
                    var userData = doc.data()

                    renderBoxChat_heading(userData)
                    sendMessage(this.id, user)
                    sendMessageByEnter(this.id, user)
                });
        }
    }
}


function renderBoxChat_heading(userData) {
    var headingChatBox = document.querySelector('.heading-chatBox')
    var htmls = `
        <div class="header-userImage">
            <img src=${userData.imgURL}>
        </div>
        <h5 class="heading-userName">${userData.name}</h5>
    `
    headingChatBox.innerHTML = htmls
}


// SENDING MESSAGE
function sendMessage(receiverUid, sender) {

    var sendingBtn = document.querySelector('.sending-btn')
    sendingBtn.onclick = function () {

        if (message.value) {
            db.collection("message").doc(`${receiverUid}`)
                .onSnapshot((doc) => {
                    var messageData = doc.data()
                    var object = {
                        senderName: sender.displayName,
                        message: message.value,
                        senderImgURL: sender.photoURL,
                        date: Date()
                    }

                    if (messageData) {
                        db.collection('message').doc(`${receiverUid}`).update({
                            message: firebase.firestore.FieldValue.arrayUnion(object)
                        })
                    }

                    else {
                        db.collection('message').doc(`${receiverUid}`).set({
                            message: []
                        })
                    }
                });
           
        }
        else {
            console.log("Enter your message");
        }
    }
    renderMessage(receiverUid, sender)
}


function sendMessageByEnter(receiverUid, sender) {
    document.querySelector('body').onkeypress = function (e) {
        if (e.which === 13 && message.value != "") {
            db.collection("message").doc(`${receiverUid}`)
                .onSnapshot((doc) => {
                    var messageData = doc.data()
                    var object = {
                        senderName: sender.displayName,
                        message: message.value,
                        senderImgURL: sender.photoURL,
                        date: Date()
                    }

                    if (messageData) {
                        db.collection('message').doc(`${receiverUid}`).update({
                            message: firebase.firestore.FieldValue.arrayUnion(object)
                        })
                    }

                    else {
                        db.collection('message').doc(`${receiverUid}`).set({
                            message: []
                        })
                    }
                });
        }
    }
}




function renderMessage(receiverUid, sender) {
    var boxUser_message = document.querySelector('.userMessage')

    db.collection("message").doc(`${receiverUid}`)
        .onSnapshot((doc) => {
            var arrayMessage = doc.data().message
            var bodyChatBox = document.querySelector('.body-chatBox')
            bodyChatBox.innerHTML = ""

            arrayMessage.map(function (objMessage) {
                if (objMessage.senderName === sender.displayName) {
                    var html = `
                    <div class="senderBox-right">
                        <button class="delete-btn" onclick="deleting(this, ${receiverUid})" name="${objMessage.senderName}" id="${objMessage.date}">Delete</button>
                        <div class="sender-message">${objMessage.message}</div> 
                        <div class="sender-avatar">
                            <img src="${objMessage.senderImgURL}" alt="">
                        </div>
                    </div>
                    `
                    bodyChatBox.innerHTML += html
                    // boxUser_message.innerHTML = 'You:' + '' + objMessage.message
                }
                else {
                    var html = `
                    <div class="senderBox-left">
                        <div class="sender-avatar">
                            <img src="${objMessage.senderImgURL}" alt="">
                        </div>
                        <div class="sender-message">${objMessage.message}</div>
                    </div>
                    `
                    bodyChatBox.innerHTML += html
                    // boxUser_message.innerH TML = objMessage.message
                }
            })
        });
}

$(".bodyChatBox").animate({ scrollTop: $display[0].scrollHeight }, 'fast');


// chatWindow = document.querySelector(".bodyChatBox"); 
// var xH = chatWindow.scrollHeight; 
// chatWindow.scrollTo(0, xH);