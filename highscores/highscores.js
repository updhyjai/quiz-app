console.log('Welcome to highscores!')

const highScoresListHtml = document.getElementById('highscores-list')

const highscores = JSON.parse(localStorage.getItem('highScores')) || []

highScoresListHtml.innerHTML = highscores.map(highscore=>{
    return `<div><span>${highscore.username}</span>  <span>${highscore.score}</span></div>`
}).join('')