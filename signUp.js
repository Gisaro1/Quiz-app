const getElements = (...ids)=> ids.reduce((obj,id) => ({...obj,[id]:document.getElementById(id)}),{});
const {form,username,password ,passwordConfirm} = getElements('form','username','password','passwordConfirm');

const getStoredUsers = () =>{
    try{
       return JSON.parse(localStorage.getItem("users")) ?? [];
    } catch(error){
        console.log("Failed to parse users from localStorage:", error);
        return [];
    };
}
const getValues = ({username,password,passwordConfirm} = {}) =>({
        usernameEnter:username.value.trim(),
        passwordEnter:password.value.trim(),
        confirmEnter:passwordConfirm.value.trim()
})

const handlerSignUp = (event) =>{
    event.preventDefault();
    
    const{usernameEnter,passwordEnter,confirmEnter} = getValues({username,password,passwordConfirm});

    if(!usernameEnter || !passwordEnter || !confirmEnter){
        showMessage("All fields are required");
        return;
    }
    const checkPassword = {
        hasLower:/[a-z]/.test(passwordEnter),
        hasUpper:/[A-Z]/.test(passwordEnter),
        hasNumber:/\d/.test(passwordEnter),
        hasSpecial:/[!@#$%^&*()-+.]/.test(passwordEnter),
        isLongEnough:passwordEnter.length >= 8
    }
    const{hasLower,hasUpper,hasNumber,hasSpecial,isLongEnough} = checkPassword;
    if(!hasLower || !hasUpper || !hasNumber || !hasSpecial || !isLongEnough){
        showMessage("Password must be at least 6 characters and include one lowercase, one uppercase, and one digit")
        return;
    }
    if(passwordEnter !== confirmEnter){
        showMessage("Passwords do not match");
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
function showMessage(message,color = "red"){
    const msg = document.getElementById('message');
    msg.textContent = message;
    msg.className = "text-sm text-center font-semibold mt-1 py-2 px-3 rounded-md";
    msg.style.color = color;
}
const hasAccount = () =>(window.location.href = 'index.html');