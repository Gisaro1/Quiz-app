const getElements = (...ids) =>{
    return ids.reduce((obj,id) =>{
        obj[id] = document.getElementById(id);
        return obj;
    },{});
};


const {userName,percentage,score,grade,retryBtn,logoutBtn} = getElements('username','percentage','score','grade','retryBtn','logoutBtn');

const checkSession = () =>{
    try{
        const session = JSON.parse(localStorage.getItem('session'));
        if(!session?.loggedIn) throw new Error('not Logged In');
        return session;
    } catch(error){
        window.location.href = 'index.html';
        return null;
    }
}

const getResults = () =>{
    try{
        const results = JSON.parse(localStorage.getItem('quizResults'));
        if(!results || results.score === undefined || results.total === undefined) throw new Error('No results found!');
        return results;
    } catch(error){
        window.location.href = 'index.html';
        return null;
    }
}


const getGradesInfo = (percentage) =>{
    if(percentage >= 90) return {text: 'A+', color: 'green'};
    if(percentage >= 80) return {text: 'A', color: 'blue'};
    if(percentage >= 70) return {text: 'B', color: 'orange'};
    if(percentage >= 60) return {text: 'C', color: 'yellow'};
    if(percentage >= 50) return {text: 'D', color: 'red'};
    return {text: 'F', color: 'gray'};
}

const displayResults = (session,results) =>{
    const {score: userScore, total} = results;
    const percent = Math.round((userScore / total) * 100);
    const gradeInfo = getGradesInfo(percent);

    if(userName) userName.textContent = `Welcome, ${session.username}`;
    if(percentage) percentage.textContent = `${percent}%`;
    if(score) score.textContent = `${userScore} / ${total}`;
    if(grade){
        grade.textContent = gradeInfo.text;
        grade.style.color = gradeInfo.color;
    }
}


const handleRetry = () =>{
    localStorage.removeItem('quizResults');
    window.location.href = 'question.html';
}


const handleLogout = () =>{
    localStorage.removeItem('session');
    localStorage.removeItem('quizResults');
    window.location.href = 'index.html';
}
document.addEventListener('DOMContentLoaded', () =>{
    const session = checkSession();
    if(!session) return;
    const results = getResults();
    if(!results) return;
    displayResults(session,results);
    retryBtn.addEventListener('click',handleRetry);
    logoutBtn.addEventListener('click',handleLogout);
}
);