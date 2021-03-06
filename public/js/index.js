var db = firebase.firestore()
var boxUser_Container = document.querySelector('.boxUsers-container')
var message = document.querySelector('.message')


function resolveAfter1Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 1000);
    });
}


// LOGIN
function login() {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
            var credential = result.credential;
            // The signed-in user info.
            var user = result.user;
            console.log(user);

            localStorage.setItem('userData', JSON.stringify(user))




            async function asyncCall() {
                saveUser(user)
                await resolveAfter1Seconds();
                window.location.assign('./homepage.html')
            }
            asyncCall();


            // window.location.assign('./homepage.html');




            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var accessToken = credential.accessToken;

            // ...
        })
        .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;

            // ...
        });


}



function saveUser(user) {
    db.collection("users").doc(`${user.uid}`).set({
        name: user.displayName,
        email: user.email,
        imgURL: user.photoURL,
        docUserID: user.uid
    })
}

