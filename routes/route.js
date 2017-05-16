import express from 'express';
import assessment from '../config/assessment-database';

const router = express.Router();


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
  const result = assessment.getCourses();
  result.then((course) => {
    res.render('startquiz.ejs', { courses: course });
  });
});

router.post('/loadquiz', (req, res) => {
  const course = req.body.course;
  const result = assessment.getQuestions(course);
  result.then((questions) => {
    res.send(questions);
  });
});

export default router;
