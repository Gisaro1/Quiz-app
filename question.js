let questions = [];
let current = 0;
let score = 0;

const getElements = (...ids) => {
  return ids.reduce((obj, id) => {
    obj[id] = document.getElementById(id);
    return obj;
  }, {});
};

const variables = getElements(
  'questionText',
  'optionsContainer',
  'progress',
  'progressBar',
  'message',
  'welcomeUser',
  'nextBtn',
  'backBtn',
  'finishBtn'
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
    const response = await fetch('question.json');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    questions = Array.isArray(data) ? data : (data.questions || []);
    current = 0;
    score = 0;
    showQuestion();
  } catch (error) {
    console.error('Failed to load questions:', error);
    showMessage('Error loading quiz data. Please refresh.', 'red');
  }
};

const showQuestion = () => {
  const q = questions[current];
  if (!q) return;

  variables.questionText.textContent = q.question;
  variables.progress.textContent = `Question ${current + 1} / ${questions.length}`;
  updateProgress();
  renderOptions(q.options);
  variables.message.textContent = '';

  if (variables.backBtn) variables.backBtn.classList.toggle('hidden', current === 0);
  const isLast = current === questions.length - 1;
  if (variables.nextBtn) variables.nextBtn.classList.toggle('hidden', isLast);
  if (variables.finishBtn) variables.finishBtn.classList.toggle('hidden', !isLast);
};

const renderOptions = (options) => {
  variables.optionsContainer.innerHTML = options
    .map(
      (option) => `
        <label class="flex items-center gap-3 border border-gray-200 rounded-md px-4 py-3 cursor-pointer hover:bg-indigo-50">
          <input type="radio" name="option" value="${option}" class="accent-indigo-500"/>
          <span class="text-sm text-gray-700">${option}</span>
        </label>
      `
    )
    .join('');
};

const updateProgress = () => {
  const percent = ((current + 1) / questions.length) * 100;
  variables.progress.textContent = `Question ${current + 1} / ${questions.length}`;
  variables.progressBar.style.width = `${percent}%`;
};

const handleBack = () => {
  if (current > 0) {
    current--;
    showQuestion();
  }
};

const handleNext = () => {
  const selected = document.querySelector('input[name="option"]:checked');
  if (!selected) {
    showMessage('Please select an answer');
    return;
  }

  if (selected.value === questions[current].answer) score++;

  current++;
  if (current < questions.length) showQuestion();
  else saveResults();
};

const handleFinish = () => saveResults();

const saveResults = () => {
  localStorage.setItem(
    'quizResults',
    JSON.stringify({
      score,
      total: questions.length
    })
  );
  window.location.href = 'marks.html';
};

const showMessage = (message, color = 'red') => {
  variables.message.textContent = message;
  variables.message.style.color = color;
};

const welcomeUser = () => {
  try {
    const session = JSON.parse(localStorage.getItem('session') ?? 'null');
    if (variables.welcomeUser && session?.username) {
      variables.welcomeUser.textContent = `Welcome, ${session.username}!`;
    }
  } catch (error) {
    console.error('Error parsing session', error);
  }
};

window.handleBack = handleBack;
window.handleNext = handleNext;
window.handleFinish = handleFinish;

document.addEventListener('DOMContentLoaded', () => {
  if (checkSession() === false) return;
  welcomeUser();
  loadQuestion();
});



