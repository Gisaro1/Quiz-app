const getElements = (...ids)=> ids.reduce((obj,id) => ({...obj,[id]:document.getElementById(id)}),{});
const {form,username,password ,passwordConfirm} = getElements('form','username','password','passwordConfirm');

function getStoredUsers(){
    try{
       const rawData = localStorage.getItem("users");
       return rawData ? JSON.parse(rawData) : [];
    } catch(error){
        console.log("Failed to parse users from localStorage:", error);
        return []
    }
}
function getValues({username,password,passwordConfirm}){
    return{
        usernameEnter:username.value.trim(),
        passwordEnter:password.value.trim(),
        confirmEnter:passwordConfirm.value.trim()
    };
}

function handlerSignUp(event){
    event.preventDefault();
    
    const{usernameEnter,passwordEnter,confirmEnter} = getValues({username,password,passwordConfirm});

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
    users.push({username:usernameEnter, password:passwordEnter})
    localStorage.setItem('users', JSON.stringify(users));

    showMessage("Sign up successful!", "green")
    form.reset();
    setTimeout(() => {
    window.location.href = 'question.html';
    }, 1000);

}
function showMessage(message,color){
    const msg = document.getElementById('message');
    msg.textContent = message;
    msg.className = "text-sm text-center font-semibold mt-1 py-2 px-3 rounded-md";
    msg.style.color = color;
}
function hasAccount(){
    window.location.href = 'index.html'
}