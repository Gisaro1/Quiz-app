const getElements = (...ids) => ids.reduce((obj, id) => ({...obj, [id]: document.getElementById(id)}), {});
const {username, password} = getElements('username', 'password');

function getStoredUsers() {
  try {
    const rawData = localStorage.getItem("users");
    return rawData ? JSON.parse(rawData) : [];
  } catch(error) {
    console.log("Failed to parse users from localStorage:", error);
    return [];
  }
}

function handleLogin(event) {
  event.preventDefault();

  const usernameEnter = username.value.trim();
  const passwordEnter = password.value.trim();

  if(!usernameEnter || !passwordEnter) {
    showMessage("All fields are required", "red");
    return;
  }

  const users = getStoredUsers();

  const found = users.find(user => 
    user.username.toLowerCase() === usernameEnter.toLowerCase() && 
    user.password === passwordEnter
  );

  if(!found) {
    showMessage("Invalid username or password", "red");
    return;
  }
  localStorage.setItem("session", JSON.stringify({ 
    loggedIn: true, 
    username: found.username 
  }));
   window.location.href = 'question.html';
}
function showMessage(message, color) {
  const msg = document.getElementById('message');
  msg.textContent = message;
  msg.className = "text-sm text-center font-semibold mt-1 py-2 px-3 rounded-md";
  msg.style.color = color;
}
function goToSignUp() {
     window.location.href = 'signUp.html';
}