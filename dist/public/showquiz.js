/*const startQuiz = document.getElementById('startquiz');
//const course = document.getElementById('course');
//const displayQuestion = document.getElementById('displayQuestion');
const submitButton = document.getElementById('submitquiz');
const numberOfQuestion = 3;
let numberOfCorrectAnswers = 0;

/*
const showQuestion = (quizObject) => {
  let html = '';
  for (let option = 0; option < quizObject.length; option += 1) {
    html += (option + 1) + '. ' + quizObject[option].question + '<br>';
    html += "<input type='radio' name='" + ('options'+(option + 1)) + "' class='" + ('options' + (option + 1)) + "' value='" + quizObject[option].option1 + "'>" + quizObject[option].option1 + "</input><br>";
    html += "<input type='radio' name='" + ('options'+(option + 1)) + "' class='" + ('options'+ (option + 1)) + "' value='" + quizObject[option].option2 + "'>" + quizObject[option].option2 + "</input><br>";
    html += "<input type='radio' name='" + ('options'+(option + 1)) + "' class='" + ('options'+ (option + 1)) + "' value='" + quizObject[option].option3 + "'>" + quizObject[option].option3 + "</input><br>";
    html += "<input type='radio' name='" + ('options'+(option + 1)) + "' class='" + ('options'+ (option + 1)) + "' value='" + quizObject[option].option4 + "'>" + quizObject[option].option4 + "</input><br>";
    html += "<input type='hidden' name='" + ('options'+(option + 1)) + "' class='" + ('options'+ (option + 1)) + "' value='" + quizObject[option].correctAnswer + "'>" + "</input><br>";
  }
  return html;
};

startQuiz.addEventListener('click', () => {
  fetch('loadquiz', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'course': course.value })
  }).then((res) => {
    if (res.ok) {
      res.json().then((questionsObject) => {
        if (questionsObject.length > 0) {
          displayQuestion.innerHTML = showQuestion(questionsObject);
          submitButton.style.visibility = 'visible';
          numberOfQuestion = questionsObject.length;
        } else {
          displayQuestion.innerHTML = '<p>Error occured!</p>';
        }
      });
    }
  });
});*/
/*
const sendResulToServer = (questionPassed, totalQuestion) => {
  fetch('showresult', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({'score': questionPassed, 'totalQuestionNo': totalQuestion })
  });
};

const isCorrect = (options) => {
  let status = false;
  for (let option = 0; option < options.length; option += 1) {
    if (options[option].checked) {
      if (options[option].value === options[options.length - 1].value) {
        status = true;
      }
    }
  }
  return status;
};

/*submitButton.addEventListener('click', () => {
  for (let question = 0; question < numberOfQuestion; question += 1) {
    const options = document.getElementsByClassName((question + 1));
    if (isCorrect(options)) {
      numberOfCorrectAnswers += 1;
    }
  }
  sendResulToServer(numberOfCorrectAnswers, numberOfQuestion);
  alert('Got ' + numberOfCorrectAnswers + ' out of ' + numberOfQuestion + ' questions' + "\nPercentage: " + Math.floor((numberOfCorrectAnswers / numberOfQuestion) * 100) + '%');
  numberOfCorrectAnswers = 0;
});*/
"use strict";