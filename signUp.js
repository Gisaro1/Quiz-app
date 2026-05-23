const form = document.getElementById('form');
const username = document.getElementById('username');
const password = document.getElementById('password');
const passwordConfirm = document.getElementById('confirm');

function getStoredUsers(){
    try{
       const rawData = localStorage.getItem("users");
       return rawData ? JSON.parse(rawData) : [];
    } catch(error){
        console.log("Failed to parse users from localStorage:", error);
        return []
    }
}

function handlerSignUp(event){
    event.preventDefault();

    const usernameEnter = username.value.trim();
    const passwordEnter = password.value.trim();
    const confirmEnter = passwordConfirm.value.trim();

    if(!usernameEnter || !passwordEnter || !confirmEnter){
        showMessage("All fields are required", "red");
        return;
    }

    if(passwordEnter != confirmEnter){
        showMessage("Passwords do not match", "red");
        return;
    }

    const users = getStoredUsers();

    const checkExist = users.some(user => user.username.toLowerCase() === usernameEnter.toLowerCase())
    if(checkExist){
        showMessage("Username is already taken", "red");
        return;
    }
    user.push({username:usernameEnter, password:passwordEnter})
    localStorage.setItem('users', JSON.stringify(users));

    showMessage("Sign up successful!", "green")
    form.reset();

}
function showMessage(message,color){
    const msg = document.getElementById('message');
    msg.textContent = message;
    msg.style.color = color;
}
form.addEventListener('submit',handlerSignUp)