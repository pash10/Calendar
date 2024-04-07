document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var confirmEmail = document.getElementById('ConfirmEmail').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('ConfirmPassword').value;
    var errorMessage = document.getElementById('error');
    
    console.log(checkGoodReg(username, email,confirmEmail, password, confirmPassword, ));
    
    switch (checkGoodReg(username, email,confirmEmail, password, confirmPassword, )) {
        case 0:
            db.ref('users').orderByChild('username').equalTo(username).once('value', snapshot => {
                if (snapshot.exists()) {
                    errorMessage.textContent = 'Username already exists';
                    throw new Error('Username already exists');
                }
                return db.ref('users').orderByChild('email').equalTo(email).once('value');
            })
            .then(snapshot => {
                if (snapshot.exists()) {
                    errorMessage.textContent = 'Email already exists';
                    throw new Error('Email already exists');
                }
                // If no existing username or email, proceed to create new user
                return firebase.auth().createUserWithEmailAndPassword(email, password);
            })
            .then(function (userCredential) {
                // User registered successfully
                var user = userCredential.user;
                console.log('User registered:', user);

                // Use Realtime Database API to store additional user info
                return db.ref('users/' + user.uid).set({
                    username: username,
                    email: email
                });
            })
            .then(function () {
                console.log('User data stored successfully');
                window.location.href = 'login.html'; // Redirect to login page after successful registration
            })
            .catch(function (error) {
                // Handle different errors here
                errorMessage.textContent = error.message || "Something went wrong, please try again.";
                console.error('Registration error:', error);
            });
            break;
        case 1:
            errorMessage.textContent = "Username field is empty";
            break;
        case 2:
            errorMessage.textContent = "Username must have only a-z, A-Z, and 0-9";
            break;
        case 3:
            errorMessage.textContent = "Email field is empty";
            break;
        case 4:
            errorMessage.textContent = "Email is not valid";
            break;
        case 5:
            errorMessage.textContent = "Confirm Email field is empty";
            break;
        case 6:
            errorMessage.textContent = "Email and Confirm Email do not match";
            break;
        case 7:
            errorMessage.textContent = "Password field is empty";
            break;
        case 8:
            errorMessage.textContent = "Password must have a-z, A-Z, 0-9, and at least one symbol";
            break;
        case 9:
            errorMessage.textContent = "Confirm Password field is empty";
            break;
        case 10:
            errorMessage.textContent = "Password and Confirm Password do not match";
            break;
      
        default:
            errorMessage.textContent = "An unknown error occurred";
            break;
    }
});