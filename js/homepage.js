const user = firebase.auth().currentUser;

if (user) {
    document.querySelector('.login_container').display = 'none'
    document.querySelector('.homepage').display = 'block'
    
} else {
    document.querySelector('.login_container').display = 'block'
    document.querySelector('.homepage').display = 'none'

}