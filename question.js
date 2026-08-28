let questions = [];
let current = 0;
let userAnswer = [];

const getElements = (...ids) => ids.reduce((acc, id) => ((acc[id] = document.getElementById(id)), acc), {});

const el = getElements('questionText','optionsContainer','progress','progressBar','message','welcomeUser','nextBtn','backBtn'
);

const checkSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem('session'));
    if (!session?.loggedIn) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  } catch (error) {
    console.error('Session Corrupted', error);
    window.location.href = 'index.html';
    return false;
  }
};

const loadQuestion = async () => {
  try {
    const response = await fetch('question.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    const loaded = await response.json();
    questions = loaded?.questions ?? [];
    const saved = JSON.parse(localStorage.getItem('quizProgress')) || {
      current: 0,
      userAnswer: []
    };
    current = saved.current;
    userAnswer = saved.userAnswer;
    showQuestion();
  } catch (error) {
    console.error('Failed to load questions:', error);
    showMessage(`Error loading quiz data: ${error?.message ?? error}`, 'red');
  }
};

const showQuestion = () => {
  const total = questions?.length ?? 0;
  if (!total) {
    showMessage('No quiz questions found in the data file.', 'red');
    return;
  }
  const q = questions?.[current];
  if (!q?.question || !Array.isArray(q.options)) {
    showMessage('Question data is invalid.', 'red');
    return;
  }
  el.questionText.textContent = q.question;
  updateProgress();
  renderOptions(q.options, userAnswer[current]);
  el.message.textContent = '';

  el.backBtn.classList.toggle('hidden', current === 0);
  el.nextBtn.textContent = current === total - 1 ? 'Finish' : 'Next';
};

const renderOptions = (options,selectedValue) => {
  el.optionsContainer.innerHTML = options
    .map(
      (option) => `
        <label class="flex items-center gap-3 border border-gray-200 rounded-md px-4 py-3 cursor-pointer hover:bg-indigo-50">
          <input type="radio" name="option" value="${option}" class="accent-indigo-500" ${option === selectedValue ? 'checked' : ''}/>
          <span class="text-sm text-gray-700">${option}</span>
        </label>
      `
    )
    .join('');
};

const updateProgress = () => {
  const total = questions.length;
  const percent = ((current + 1) / total) * 100;
  el.progress.textContent = `Question ${current + 1} / ${total}`;
  el.progressBar.style.width = `${percent}%`;
};

const syncProgrees = () =>{
  localStorage.setItem('quizProgress', JSON.stringify({current,userAnswer}))
};

const handleBack = () => {
  if (current > 0) {
    current--;
    syncProgrees()
    showQuestion();
  }
};

const handleNext = () => {
  const selected = document.querySelector('input[name="option"]:checked');
  if (!selected) {
    showMessage('Please select an answer');
    return;
  }
  userAnswer[current] = selected.value;
  syncProgrees()
  current++;
  if (current < questions.length){
    showQuestion();
  } 
  else{
    saveResults();
  } 
};

const saveResults = () => {
  const finalScore = questions.reduce((score,q,idx)=>{
    return score + (userAnswer[idx] === q.answer ? 1 : 0)
  },0)
  localStorage.setItem(
    'quizResults',
    JSON.stringify({
      score:finalScore,
      total: questions.length
    })
  );
  localStorage.removeItem('quizProgress')
  window.location.href = 'marks.html';
};

const showMessage = (message, color = 'red') => {
  el.message.textContent = message;
  el.message.style.color = color;
};

const welcomeUser = () => {
  try {
    const session = JSON.parse(localStorage.getItem('session'));
    if (session?.username) el.welcomeUser.textContent = `Welcome, ${session.username}!`;
  } catch {
  }
};

window.handleBack = handleBack;
window.handleNext = handleNext;

document.addEventListener('DOMContentLoaded', () => {
  if (checkSession() === false) return;
  welcomeUser();
  loadQuestion();
});



