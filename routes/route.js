import express from 'express';
import assessment from '../config/assessment-database';

const router = express.Router();


router.get('/', (req,res) => {
  // get username from session to replace noordean
  res.render('studentsdashboard.ejs', { user: 'noordean', lastResult: '' });
})
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
  // 'Javascript will be replaced with latest registered course from db'
  const result = assessment.getQuestions('Javascript');
  result.then((loadedQuestion) => {
    res.render('doquiz.ejs', { questions: loadedQuestion });
  });
});

router.post('/showresult', (req, res) => {
    // add user name from session when merging
  const questions = Object.keys(req.body);
  let scores = 0;
  for (let question = 0; question < questions.length; question += 1) {
    if (Array.isArray(req.body[questions[question]])) {
      if (req.body[questions[question]][0] === req.body[questions[question]][1]) {
        scores += 1;
      }
    }
  }
  res.render('showresult.ejs', { score: scores, totalQuestionNo: 10 });
});


export default router;
