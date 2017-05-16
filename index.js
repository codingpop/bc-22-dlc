/* eslint linebreak-style: ["error", "windows"]*/
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
const upload = multer({ dest: 'uploads/' });
mongoose.connect('mongodb://noordean:ibrahim5327@ds161190.mlab.com:61190/nurudb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
const Question = mongoose.model('Question', question);

app.get('/', (req, res) => {
  Question.find({}).sort({ date: -1 }).limit(10).exec((err, questions) => {
    res.render('pages/forum.ejs', { questions: questions });
  });
});

app.post('/addQuestion', (req, res) => {
  const question = req.body.question;
  const notify = req.body.notify;
  const tag =  req.body.tag;
  console.log('recieving Questions here');
  const newQuestion = new Question({
    question: question,
    idOfPoster: 1,
    date: Date.now(),
    tag: tag,
    notify: notify
  });
  newQuestion.save((err) => {
    if (err) {
      res.send(err);
    }
    res.send('Saved');
  });
});

app.get('/question/:id', (req, res) => {
  const id = req.params.id;
  Question.findById(id, (err, uniqueQuestion) =>{
    if (err) {
      throw err;
    }
    res.render('pages/question.ejs', { question: uniqueQuestion });
  });
});

app.post('/addAnswer', (req, res) =>{
  const answer = req.body.answer;
  const questionId = req.body.questionid;
  // to change to a real userId
  const userId = 1;
  const answerObject = {
    userId: [answer, ]
  }
  res.send('We are recieving answers here');
});

app.post('/search', (req, res) => {
  const searchTerm = req.body.terms;
  Question.findOne({ name: new RegExp('^'+searchTerm+'$', "i") }, (err, doc) => {
    res.send(searchTerm);
});
});

app.listen(8000);
