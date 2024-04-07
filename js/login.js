document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var email = document.getElementById('email').value; // Assuming you're using the username field for email
    var password = document.getElementById('password').value;
    var errorMessage = document.getElementById('error');
    
    console.log(checkLogin(email,password))
    switch (checkLogin(email, password)) {
        
        case 0:
            // Firebase login
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (userCredential) {
                // User logged in successfully
                var user = userCredential.user;
                console.log('User logged in:', user);
        
                // Retrieve additional user data from Firebase database
                return db.ref('users/' + user.uid).once('value');
            })
            .then(function (snapshot) {
                if (snapshot.exists()) {
                    var userData = snapshot.val();
        
                    // Save user data to local storage
                    saveUserDataToLocalStorage({
                        username: userData.username,
                        email: email,
                    });
                    localStorage.setItem('login', true);
                    if(email == "pash1600@gmail.com"){
                        localStorage.setItem("admin","1");
                    }
                    window.location.href = 'post.html';
                } else {
                    // Throw an error if user data is not found in the database
                    throw new Error('User data not found in the database.');
                }
            })
            .catch(function (error) {
                // Provide a more specific error message
                    errorMessage.textContent = "Invald Login Credential, check you email and login Credential"
                
            });
        
            break;
        case 1:
            errorMessage.textContent = "Email field is empty";
            break;
        case 2:
            errorMessage.textContent = "Email is not valid";
            break;
        case 3:
            errorMessage.textContent = "Password field is empty";
            break;
        default:
            errorMessage.textContent = "An unknown error occurred";
            break;
    }
});