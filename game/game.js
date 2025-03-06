console.log("Welcome to the game");
// const QUESTIONS = [
//   {
//     question: "Question 1",
//     choice1: "Question 1 Choice 1",
//     choice2: "Question 1 Choice 2",
//     choice3: "Question 1 Choice 3",
//     choice4: "Question 1 Choice 4",
//     answer: 1,
//   },
//   {
//     question: "Question 2",
//     choice1: "Question 2 Choice 1",
//     choice2: "Question 2 Choice 2",
//     choice3: "Question 2 Choice 3",
//     choice4: "Question 2 Choice 4",
//     answer: 2,
//   },
//   {
//     question: "Question 3",
//     choice1: "Question 3 Choice 1",
//     choice2: "Question 3 Choice 2",
//     choice3: "Question 3 Choice 3",
//     choice4: "Question 3 Choice 4",
//     answer: 3,
//   },
//   {
//     question: "Question 4",
//     choice1: "Question 4 Choice 1",
//     choice2: "Question 4 Choice 2",
//     choice3: "Question 4 Choice 3",
//     choice4: "Question 4 Choice 4",
//     answer: 4,
//   },
// ];

const samplequestion = {
  "type": "multiple",
  "difficulty": "easy",
  "category": "Entertainment: Film",
  "question": "Who is the main protagonist in, the 1985 film, Back to the Future?",
  "correct_answer": "Marty McFly",
  "incorrect_answers": [
      "Emmett &quot;Doc&quot; Brown",
      "Biff Tannen",
      "George McFly"
  ]
}

let QUESTIONS = []
const loadQuestion = async() => {
await fetch('https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple')
.then(resposne=>resposne.json())
.then(data=>{
  const questionsArray = data.results
  console.log('data',questionsArray[0])

  QUESTIONS = questionsArray.map(question=>{
    const formattedQuestion =  {
      question: "Question 4",
      choice1: "Question 4 Choice 1",
      choice2: "Question 4 Choice 2",
      choice3: "Question 4 Choice 3",
      choice4: "Question 4 Choice 4",
      answer: 4,
    }
    const correctAnswerIndex = Math.floor(Math.random()*4)
    const tempAnswers =[ ...question.incorrect_answers]
    tempAnswers.splice(correctAnswerIndex,0,question.correct_answer)
    console.log(tempAnswers, correctAnswerIndex)
    tempAnswers.map((answer,index)=>{
      formattedQuestion[`choice${index+1}`] = answer;
    })
    formattedQuestion.question = question.question;
    formattedQuestion.answer = correctAnswerIndex+1;

    return formattedQuestion
  })
})
.catch(err=>console.log('error occured',err))
}

let MAX_QUESTIONS = 0;
const SCORE_MULTIPLE = 5;
const CORRECT_CLASS_TO_APPLY = "correct-choice";
const INCORRECT_CLASS_TO_APPLY = "incorrect-choice";
const PROGRESS_BAR_CHANGING = "progress-bar-changing"

let isAcceptAnswer = false;
let availableQuestions = [];
let questionCounter = 0;
let score = 0;
let pickedQuestion = {};

const questionsHtml = document.getElementById("question");
const choicesTextHtml = Array.from(
  document.getElementsByClassName("choice-text")
);
const questionCounterHtml = document.getElementById('question-counter')
const scoreHtml = document.getElementById('score')
const progressBarStatusHtml = document.getElementById('progress-bar-status')
const loaderHtml = document.getElementById('loader')
const gameHtml = document.getElementById('game')

console.log(questionsHtml, choicesTextHtml);

const updateQuestionCounter=(isReset = false) => {
  questionCounter = isReset ? 0 : questionCounter+1;
  questionCounterHtml.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
}


const updateScore = (isReset = false) => {
  score = isReset ? 0 : Number(score) + SCORE_MULTIPLE;
  scoreHtml.innerText = score;
}

const updateProgressBar = (isReset = false) => {
  const progressPercent = questionCounter/MAX_QUESTIONS * 100;
  console.log('progresspercent: ',progressPercent)
  progressBarStatusHtml.style.width = `${progressPercent}%`
}

const getNewQuestion = () => {
  if (
    questionCounter >= MAX_QUESTIONS.length ||
    availableQuestions.length === 0
  ) {
    
    console.log("end of quiz");
    isAcceptAnswer = false;
    localStorage.setItem('finalScore',score)
    gameHtml.classList.add('hidden')
    loaderHtml.classList.remove('hidden')
    setTimeout(() => {
      window.location.assign('../end/end.html')
    }, 1500);
    
    return;
  }
  const pickAQuestionIndex = Math.floor(
    Math.random() * availableQuestions.length
  );
  pickedQuestion = availableQuestions[pickAQuestionIndex];
  questionsHtml.innerText = pickedQuestion.question;
  choicesTextHtml.forEach((choice) => {
    const choiceIndex = choice.dataset["number"];
    choice.innerText = pickedQuestion[`choice${choiceIndex}`];
  });
  updateQuestionCounter()
  updateProgressBar()
  availableQuestions.splice(pickAQuestionIndex, 1);
  isAcceptAnswer = true;
};

const startGame = async () => {
  gameHtml.classList.add('hidden')
  loaderHtml.classList.remove('hidden')
  await loadQuestion()
  availableQuestions = [...QUESTIONS];
  MAX_QUESTIONS = availableQuestions.length
  updateQuestionCounter(true)
  updateScore(true)
  updateProgressBar(true)
  getNewQuestion();
  loaderHtml.classList.add('hidden')
  gameHtml.classList.remove('hidden')
};


const handleChoiceClick = (e) => {
  console.log("event", e.target, e.target.className);

  if(e.target.className !== 'choice-text'){
    console.warn('wrong click detected')
    return
  }
  if (!isAcceptAnswer) {
    console.log("not accepting answers now");
    return;
  }
  selectedChoice = e.target;
  const selectedChoiceNumber = selectedChoice.dataset["number"];
  const isCorrect =
    Number(pickedQuestion?.answer) === Number(selectedChoiceNumber);
  let classToApply = INCORRECT_CLASS_TO_APPLY;
  if(isCorrect) {
    classToApply=CORRECT_CLASS_TO_APPLY;
    updateScore()
  } 
  selectedChoice?.parentElement?.classList?.add(classToApply);

  setTimeout(() => {
    selectedChoice?.parentElement?.classList?.remove(classToApply);
   
    getNewQuestion();
  }, 1000);
};


choicesTextHtml.forEach((choice) => {
  document.addEventListener("click", handleChoiceClick);
});


startGame();
