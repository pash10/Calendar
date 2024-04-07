document.addEventListener('DOMContentLoaded', function() {
    var logoutLink = document.getElementById('logoutButton');
    if (logoutLink) {
        logoutLink.addEventListener('click', signOutUser);
    } else {
        console.error('Logout link not found');
    }
});

function signOutUser() {
    // Using Firebase's signOut method
    firebase.auth().signOut().then(() => {
        // Sign-out successful
        console.log('User signed out.');

        // Clear user data from local storage
        clearLocalStorageData();

        // Update login status in local storage
        localStorage.setItem('login', false);

        localStorage.setItem("admin","0");

        // Redirect to login page or other appropriate action
        window.location.href = 'login.html';
    }).catch((error) => {
        // Handle errors here
        console.error('Sign out error:', error);
    });
}

function clearLocalStorageData() {
    // Clear specific user data or all data
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('productSerial');
    // Alternatively, to clear all data:
    // localStorage.clear();
}