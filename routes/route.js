
import assessment from '../config/assessment-database';




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

/* eslint linebreak-style: ["error", "windows"]*/
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const router = express.Router();
router.set('view engine', 'ejs');
mongoose.connect('mongodb://noordean:ibrahim5327@ds161190.mlab.com:61190/nurudb');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const Schema = mongoose.Schema;
const question = new Schema({
  question: {
    type: String, required: true
  },
  idOfPoster: {
    type: Number, required: true
  },
  date: {
    type: Date, required: true
  },
  tag: {
    type: String, required: true
  },
  votes: {
    numberofvotes: {
      type: Number, required: false
    },
    voters: {
      type: Array, required: false
    }
  },
  notify: {
    type: String, required: true
  },
  answer: {
    poster: { type: Array, required: false }
  },
  views: {
    viewers: { type: Array, required: false }
  }
},
  { collection: 'Forum' }
);
const answers = new Schema({
  questionid: {
    type: String, required: true
  },
  idOfPoster: {
    type: Number, required: true
  },
  value: {
    type: String, required: true
  },
  date: {
    type: Date, required: true
  },
  voters: {
    type: Array, required: false
  }
},
  { collection: 'Answers' }
);

const Question = mongoose.model('Question', question);
const Answer = mongoose.model('Answer', answers);

router.get('/forum', (req, res) => {
  Question.find({}).sort({ date: -1 }).limit(10).exec((err, allQuestions) => {
    Question.find({}).exec((err, totalQuestion) => {
      if (err) {
        throw err;
      } else {
        const totalRecords = totalQuestion.length;
        res.render('pages/forum.ejs', { questions: allQuestions, totalRecord: totalRecords });
      }
    });
  });
});

router.post('/addQuestion', (req, res) => {
  const questionToAdd = req.body.question;
  const notifyToAdd = req.body.notify;
  const tagToAdd = req.body.tag;
  // to add id of logined in user as idOfPoster
  const newQuestion = new Question({
    question: questionToAdd,
    idOfPoster: 1,
    date: Date.now(),
    tag: tagToAdd,
    notify: notifyToAdd
  });
  newQuestion.save((err) => {
    if (err) {
      res.send(err);
    }
    res.send('Saved');
  });
});

router.get('/question/:id', (req, res) => {
  const id = req.params.id;
  if (id.length >= 20) {
    Question.findById(id, (err, uniqueQuestion) => {
      if (err) {
        throw err;
      }
      Answer.find({ questionid: id }, (err, uniqueAnswers) => {
        res.render('pages/question.ejs', { question: uniqueQuestion, uniqueAnswer: uniqueAnswers });
      });
    });
  } else {
    Question.find({ tag: id }, (err, singleQuestion) => {
      const totalRecords = singleQuestion.length;
      if (err) {
        throw err;
      }
      if (singleQuestion.length === 0) {
        res.render('pages/forum404.ejs');
      } else {
        res.render('pages/forum.ejs', { questions: singleQuestion, totalRecord: totalRecords });
      }
    });
  }
});

router.post('/addAnswer', (req, res) => {
  const answer = req.body.answer;
  const questionId = req.body.questionid;
  const userId = 1;   // to change to a real userId
  const newAnswer = new Answer({
    questionid: questionId,
    idOfPoster: userId,
    value: answer,
    date: Date.now()
  });
  newAnswer.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send('Added');
    }
  });
});

router.post('/search', (req, res) => {
  const searchTerm = req.body.term;
  Question.find({ question: new RegExp(searchTerm, 'i') }).limit(5).exec((err, doc) => {
    if (err) {
      throw err;
    }
    res.send(doc);
  });
});

router.post('/addvote', (req, res) => {
  // to change to real user
  const userId = 1;
  const answerId = req.body.answerid;
  Answer.findById(answerId, (err, answer) => {
    const voters = answer.voters;
    if (voters.indexOf(userId) < 0) {
      voters.push(userId);
      answer.voters = voters;
      answer.save();
      res.send('Done');
    } else {
      res.send('You have voted already');
    }
  });
});
