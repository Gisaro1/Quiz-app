let questions = [];
let current = 0;
let score = 0;

const checkSession = () =>{
    const session = JSON.parse(localStorage.getItem('session'));
    if (!session || !session.loggedIn) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}


const loadQuestion = async() =>{
    try{
        const response = await fetch('question.json');
        const data = await response.json();
        // question.json is an object: { title, author, questions: [...] }
        questions = Array.isArray(data) ? data : data.questions;
        current = 0;
        score = 0;
        showQuestion();

    } catch(error){
        console.error("Failed to load questions:", error);
    }
}

const showQuestion = () =>{
    const q = questions[current];
    document.getElementById('questionText').innerHTML = q.question;
    document.getElementById('progress').textContent = `Question ${current + 1} / ${questions.length}`;
    updateProgress();
    renderOptions(q.options);
    document.getElementById('message').textContent = '';
}

const renderOptions = (options) =>{
    const container = document.getElementById('optionsContainer');
    container.innerHTML = "";
    options.forEach((option, index) =>{
        container.innerHTML +=`
      <label class="flex items-center gap-3 border border-gray-200 rounded-md px-4 py-3 cursor-pointer hover:bg-indigo-50">
        <input type="radio" name="option" value="${option}" class="accent-indigo-500"/>
        <span class="text-sm text-gray-700">${option}</span>
      </label>
    `;

    });
}

const updateProgress = () =>{
    const percent = ((current + 1)/questions.length)*100;
    document.getElementById('progressBar').style.width = `${percent}%`
}

const handleNext = () =>{
    const selected = document.querySelector('input[name = "option"]:checked');

    // If user didn't select an option, stop here.
    if (!selected) {
        showMessage("Please select an answer");
        return;
    }

    // Update score/current based on selected answer.
    if (selected.value === questions[current].answer) {
        score++;
    }

    current++;
    (current < questions.length) ? showQuestion() : saveResults(); 
}


const saveResults = () =>{
    // Save results so results.html can read them from localStorage.
    localStorage.setItem('quizResults', JSON.stringify({
        score,
        total: questions.length
    }));

    window.location.href = 'results.html';
}


const showMessage = (message,color = "red") =>{
    const msg = document.getElementById('message');
    msg.textContent = message;
    msg.style.color = color;
}

const welcomeUser = () =>{
    const session = JSON.parse(localStorage.getItem('session'));

    // question.html uses id="welcomeUser".
    const el = document.getElementById('welcomeUser');
    if (el && session?.username) {
        el.textContent = `Welcome, ${session.username}!`;
    }
}

document.addEventListener('DOMContentLoaded', () =>{
    if (checkSession() === false) return;

    welcomeUser();
    loadQuestion();

    // question.html calls handleNext() inline via onclick, so we don't need a nextBtn listener.
});

