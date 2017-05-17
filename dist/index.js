'use strict';

/* eslint linebreak-style: ["error", "windows"]*/
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'ejs');
mongoose.connect('mongodb://noordean:ibrahim5327@ds161190.mlab.com:61190/nurudb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var Schema = mongoose.Schema;
var question = new Schema({
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
}, { collection: 'Forum' });

var Question = mongoose.model('Question', question);

var answers = new Schema({
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
}, { collection: 'Answers' });

var Answer = mongoose.model('Answer', answers);
app.get('/forum', function (req, res) {
  Question.find({}).sort({ date: -1 }).limit(10).exec(function (err, allQuestions) {
    Question.find({}).exec(function (err, totalQuestion) {
      if (err) {
        throw err;
      } else {
        var totalRecords = totalQuestion.length;
        res.render('pages/forum.ejs', { questions: allQuestions, totalRecord: totalRecords });
      }
    });
  });
});

app.post('/addQuestion', function (req, res) {
  var questionToAdd = req.body.question;
  var notifyToAdd = req.body.notify;
  var tagToAdd = req.body.tag;
  // to add id of logined in user as idOfPoster
  var newQuestion = new Question({
    question: questionToAdd,
    idOfPoster: 1,
    date: Date.now(),
    tag: tagToAdd,
    notify: notifyToAdd
  });
  newQuestion.save(function (err) {
    if (err) {
      res.send(err);
    }
    res.send('Saved');
  });
});

app.get('/question/:id', function (req, res) {
  var id = req.params.id;
  if (id.length >= 20) {
    Question.findById(id, function (err, uniqueQuestion) {
      if (err) {
        throw err;
      }
      Answer.find({ questionid: id }, function (err, uniqueAnswers) {
        res.render('pages/question.ejs', { question: uniqueQuestion, uniqueAnswer: uniqueAnswers });
      });
    });
  } else {
    Question.find({ tag: id }, function (err, singleQuestion) {
      var totalRecords = singleQuestion.length;
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

app.post('/addAnswer', function (req, res) {
  var answer = req.body.answer;
  var questionId = req.body.questionid;
  var userId = 1; // to change to a real userId
  var newAnswer = new Answer({
    questionid: questionId,
    idOfPoster: userId,
    value: answer,
    date: Date.now()
  });
  newAnswer.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send('Added');
    }
  });
});

app.post('/search', function (req, res) {
  var searchTerm = req.body.term;
  Question.find({ question: new RegExp(searchTerm, 'i') }).limit(5).exec(function (err, doc) {
    if (err) {
      throw err;
    }
    res.send(doc);
  });
});

app.post('/addvote', function (req, res) {
  // to change to real user
  var userId = 1;
  var answerId = req.body.answerid;
  Answer.findById(answerId, function (err, answer) {
    var voters = answer.voters;
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

app.post('/addviews', function (req, res) {
  res.send('we register views here');
});

app.listen(8000);