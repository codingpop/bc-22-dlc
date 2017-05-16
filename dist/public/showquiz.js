'use strict';

var startQuiz = document.getElementById('startquiz');
var course = document.getElementById('course');
var displayQuestion = document.getElementById('displayQuestion');
var submitButton = document.getElementById('submitquiz');
var numberOfQuestion = 0;
var numberOfCorrectAnswers = 0;

var showQuestion = function showQuestion(quizObject) {
  var html = '';
  for (var option = 0; option < quizObject.length; option += 1) {
    html += option + 1 + '. ' + quizObject[option].question + '<br>';
    html += "<input type='radio' name='" + ('options' + (option + 1)) + "' class='" + ('options' + (option + 1)) + "' value='" + quizObject[option].option1 + "'>" + quizObject[option].option1 + "</input><br>";
    html += "<input type='radio' name='" + ('options' + (option + 1)) + "' class='" + ('options' + (option + 1)) + "' value='" + quizObject[option].option2 + "'>" + quizObject[option].option2 + "</input><br>";
    html += "<input type='radio' name='" + ('options' + (option + 1)) + "' class='" + ('options' + (option + 1)) + "' value='" + quizObject[option].option3 + "'>" + quizObject[option].option3 + "</input><br>";
    html += "<input type='radio' name='" + ('options' + (option + 1)) + "' class='" + ('options' + (option + 1)) + "' value='" + quizObject[option].option4 + "'>" + quizObject[option].option4 + "</input><br>";
    html += "<input type='hidden' name='" + ('options' + (option + 1)) + "' class='" + ('options' + (option + 1)) + "' value='" + quizObject[option].correctAnswer + "'>" + "</input><br>";
  }
  return html;
};

startQuiz.addEventListener('click', function () {
  fetch('loadquiz', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'course': course.value })
  }).then(function (res) {
    if (res.ok) {
      res.json().then(function (questionsObject) {
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
});

var isCorrect = function isCorrect(options) {
  var status = false;
  for (var option = 0; option < options.length; option += 1) {
    if (options[option].checked) {
      if (options[option].value === options[options.length - 1].value) {
        status = true;
      }
    }
  }
  return status;
};

submitButton.addEventListener('click', function () {
  for (var question = 0; question < numberOfQuestion; question += 1) {
    var options = document.getElementsByClassName('options' + (question + 1));
    if (isCorrect(options)) {
      numberOfCorrectAnswers += 1;
    }
  }
  alert('Got ' + numberOfCorrectAnswers + ' out of ' + numberOfQuestion + ' questions' + "\nPercentage: " + Math.floor(numberOfCorrectAnswers / numberOfQuestion * 100) + '%');
  numberOfCorrectAnswers = 0;
});