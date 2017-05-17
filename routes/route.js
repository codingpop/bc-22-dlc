import express from 'express';
import assessment from '../config/assessment-database';

const router = express.Router();



router.get('/', (req, res) => {
  const username = 'noordean';
  const results = assessment.getResult(username);
  results.then((result) => {
   // get username from session to replace noordean
    res.render('studentsdashboard.ejs', { user: username, lastResult: result[0].score });
  });
});

router.get('/addquestion', (req, res) => {
  res.render('addquestion.ejs');
});

router.post('/addquestion', (req, res) => {
  const question = req.body.question;
  const option1 = req.body.option1;
  const option2 = req.body.option2;
  const option3 = req.body.option3;
  const option4 = req.body.option4;
  const rightAnswer = req.body.rightanswer;
  const course = req.body.course;
  res.send(assessment.saveQuestion(question, option1, option2, option3, option4, rightAnswer, course));
});

router.get('/startquiz', (req, res) => {
  res.render('startquiz.ejs');
});

router.get('/loadquiz', (req, res) => {
  // 'Javascript will be replaced with the student's course'
  const result = assessment.getQuestions("Let's Learn ES6");
  result.then((loadedQuestion) => {
    res.render('doquiz.ejs', { questions: loadedQuestion });
  });
});

router.post('/showresult', (req, res) => {
    // add user name and course from session when merging
  const user = 'noordean';
  const course = "Let's Learn ES6";
  const questions = Object.keys(req.body);
  let scores = 0;
  for (let question = 0; question < questions.length; question += 1) {
    if (Array.isArray(req.body[questions[question]])) {
      if (req.body[questions[question]][0] === req.body[questions[question]][1]) {
        scores += 1;
      }
    }
  }

  // save the result to database;
  assessment.saveResult(user, scores, course);
  res.render('showresult.ejs', { score: scores, totalQuestionNo: 10 });
});

router.get('/showallresult', (req, res) => {
  const username = 'noordean';
  const results = assessment.getResult(username);
  results.then((resultt) => {
    res.render('showallresult.ejs', { result: resultt });
  });
});

export default router;
