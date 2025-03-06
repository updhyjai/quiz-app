console.log('Welcome to end of the quiz!')

const usernameHtml = document.getElementById('username')
const  highScoreValueHtml = document.getElementById('high-score')
const submitBtnHtml = document.getElementById('submit-username')
const finalScoreHtml = document.getElementById('final-score')

const finalScoreVal = localStorage.getItem('finalScore') || 0
const highScores = JSON.parse(localStorage.getItem('highScores')) || []

// Set final score
finalScoreHtml.innerText = finalScoreVal


const handleUsernameInput = () => {
    const usernameValue = usernameHtml.value
    console.log('usernameValue',usernameHtml.value)
    submitBtnHtml.disabled = !usernameValue;
}

usernameHtml.addEventListener('keyup',handleUsernameInput)



const submitUsername = (event) => {
    console.log('username will submit', event)
    const currentScore = {
        username: usernameHtml.value,
        score: finalScoreVal
    }
    highScores.push(currentScore)
    highScores.sort((a,b)=>b.score-a.score)
    highScores.splice(5)
    localStorage.setItem('highScores',JSON.stringify(highScores))
    usernameHtml.value = ''
    setTimeout(() => {
        window.location.assign('../')
    }, 500);

    event.preventDefault();
}