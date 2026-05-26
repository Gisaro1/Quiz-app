const getElements = (...ids) => ids.reduce((obj, id) => ({...obj, [id]: document.getElementById(id)}), {});
const {username, password} = getElements('username', 'password');

const getStoredUsers = ()  =>{
  try {
    return JSON.parse(localStorage.getItem("users")) ?? [];
  } catch(error) {
    console.log("Failed to parse users from localStorage:", error);
    return [];
  }
}

const handleLogin = (event) =>{
  event.preventDefault();

  const usernameEnter = username.value.trim();
  const passwordEnter = password.value.trim();

  if(!usernameEnter || !passwordEnter) {
    showMessage("All fields are required");
    return;
  }

  const users = getStoredUsers();

  const found = users.find(user => 
    user.username.toLowerCase() === usernameEnter.toLowerCase() && 
    user.password === passwordEnter
  );

  if(!found) {
    showMessage("Invalid username or password");
    return;
  }
  localStorage.setItem("session", JSON.stringify({ 
    loggedIn: true, 
    username: found.username 
  }));
   window.location.href = 'question.html';
}
function showMessage(message, color = "red") {
  const msg = document.getElementById('message');
  msg.textContent = message;
  msg.className = "text-sm text-center font-semibold mt-1 py-2 px-3 rounded-md";
  msg.style.color = color;
}
const goToSignUp =() => (window.location.href = 'signUp.html');