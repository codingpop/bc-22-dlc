/* eslint linebreak-style: ["error", "windows"]*/
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import db from '../config/database';
import Course from '../models/course';

const salt = bcrypt.genSaltSync(10);
const router = express.Router();

// Nurudeen starts here
let sess;

router.get('/', (req, res) => {
  Course.find((err, data) => {
    if (err) throw err;
    res.render('index', { items: data });
  }).sort({_id : -1 }).limit(6);
});

router.get('/logout', (req, res) => {
  sess = req.session;
  req.session.destroy((err) => {
    if (err) {
      throw new Error(err);
    } else {
      res.redirect('/');
    }
  });
});

router.get('/login', (req, res) => {
  res.render('login.ejs', { error: '', inputedValues: '' });
});

router.get('/startquiz', (req, res) => {
  sess = req.session;
  if (sess.user) {
    res.render('startquiz.ejs');
  } else {
    res.redirect('/');
  }
});

router.post('/showresult', (req, res) => {
  sess = req.session;
  if (sess.user) {
    sess = req.session;
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
    db.saveResult(sess.user, scores, sess.course);
    res.render('showresult.ejs', { user: sess.user, score: scores, totalQuestionNo: 10 });
    // }
  } else {
    res.redirect('/');
  }
});

router.get('/showresult', (req, res) => {
  sess = req.session;
  if (sess.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/');
  }
});

router.get('/showallresult', (req, res) => {
  sess = req.session;
  if (sess.user) {
    const results = db.getResult(sess.user);
    results.then((resultt) => {
      res.render('showallresult.ejs', { result: resultt });
    });
  } else {
    res.redirect('/');
  }
});


router.get('/signup', (req, res) => {
  res.render('signup.ejs', { error: '', inputedValues: '' });
});

router.post('/signup', (req, res) => {
  sess = req.session;
  const userByUsername = db.getUserByUsername(req.body.username);
  const userByEmail = db.getUserByEmail(req.body.email);
  userByUsername.then((resultByUsername) => {
    userByEmail.then((resultByEmail) => {
      if (resultByUsername.length === 0 && resultByEmail.length === 0) {
        // trim and escape user's inputs
        req.sanitizeBody('first_name').trim();
        req.sanitizeBody('first_name').escape();
        req.sanitizeBody('last_name').trim();
        req.sanitizeBody('last_name').escape();
        req.sanitizeBody('username').trim();
        req.sanitizeBody('username').escape();
        req.sanitizeBody('email').trim();
        req.sanitizeBody('email').escape();
        req.sanitizeBody('password').trim();
        req.sanitizeBody('password').escape();
        req.sanitizeBody('password2').trim();
        req.sanitizeBody('password2').escape();

        // validate user inputs
        req.checkBody('last_name', 'Lastname should contain only alphanumeric characters').notEmpty().isAlphanumeric();
        req.checkBody('first_name', 'Firstname should contain only alphanumeric characters').notEmpty().isAlphanumeric();
        req.checkBody('username', 'Username should contain only alphanumeric characters').notEmpty().isAlphanumeric();
        req.checkBody('email', 'A valid email address is required').notEmpty().isEmail();
        req.checkBody('password', 'Password should contain only alphanumeric characters').notEmpty().isAlphanumeric();

        // collect validation errors
        let errors = [];
        if (req.validationErrors()) {
          errors = req.validationErrors();
        }
        if (req.body.password !== req.body.password2) {
          errors.push({ param: 'password', msg: 'The two passwords did not match' });
        }
        if (req.body.username.length < 5 || req.body.password.length < 5) {
          errors.push({ param: 'username/password', msg: 'Username and Password must contain atleast 5 characters' });
        }
        if (errors.length > 0) {
          res.render('signup.ejs', { error: errors, inputedValues: req.body });
        } else {
          const hashedPassword = bcrypt.hashSync(req.body.password, salt);
          db.registerUsers(req.body.first_name, req.body.last_name, req.body.email, req.body.username, hashedPassword);
          sess.user = req.body.username;
          Course.find((err, data) => {
            if (err) throw err;
            res.render('dashboard', { items: data, user: sess.user });
          });
        }
      } else {
        res.render('signup.ejs', { error: [{ msg: 'You have registered before, kindly go and login' }], inputedValues: req.body });
      }
    });
  });
});

router.post('/login', (req, res) => {
  sess = req.session;
  const userByUsername = db.getUserByUsername(req.body.username);
  userByUsername.then((result) => {
    if (result.length !== 0) {
      if (bcrypt.compareSync(req.body.password, result[0].password)) {
        if (req.body.username === 'admin') {
          res.render('admindashboard.ejs');
        } else {
          sess.userID = result[0].id;
          sess.user = result[0].username;
          
          Course.find((err, data) => {
            if (err) throw err;
            res.render('dashboard', { items: data, user: sess.user });
          });
        }
      } else {
        res.render('login.ejs', { error: 'Incorrect password', inputedValues: req.body });
      }
    } else {
      res.render('login.ejs', { error: 'User does not exist', inputedValues: req.body });
    }
  });
});

router.get('/watch/:id', (req, res) => {
  const idValue = req.params.id;
  Course.findOne({ _id: idValue }, (err, data) => {
    if (err) throw err;
    const chapters = data.chapters;
    const display = chapters[0].resource;
    res.render('watch', { item: data, video: display });
  });
});

router.get('/watch/video/:video', (req, res) => {
  const videoName = req.params.video;
  Course.findOne({ 'chapters.name': videoName }, (err, data) => {
    if (err) throw err;
    const chapters = data.chapters;
    let display = chapters[0].resource;
    chapters.forEach((field) => {
      if (videoName === field.name) {
        display = field.resource;
      }
    });
    res.render('watch', { item: data, video: display });
  });
});

router.get('/library', (req, res) => {
  res.render('library');
});

router.get('/profile', (req, res) => {
  sess = req.session;
  if (sess.user) {
  const results = db.getResult(sess.user);
  results.then((records) => {
    res.render('profile', { user: sess.user, lastResult: records });
  });
}
else {
  res.redirect('/');
}
});

router.get('/assessment', (req, res) => {
  sess = req.session;
  if (sess.user) {
    Course.find((err, data) => {
      if (err) throw err;
      res.render('assessment', { items: data, user: sess.user });
    });
  } else {
    res.redirect('/');
  }
});

router.get('/dashboard', (req, res) => {
  sess = req.session;
  if (sess.user) {
    Course.find((err, data) => {
      if (err) throw err;
      res.render('dashboard', { items: data, user: sess.user });
    });
  } else {
    res.redirect('/');
  }
});

router.get('/quiz/:id', (req, res) => {
  sess = req.session;
  const idValue = req.params.id;
  Course.findOne({ _id: idValue }, (err, data) => {
    if (err) throw err;
    const result = db.getQuestions(data.title);
    result.then((loadedQuestion) => {
      res.render('doquiz.ejs', {questions: loadedQuestion});
    });
  });
});

const Schema = mongoose.Schema;
const question = new Schema({
  question: {
    type: String, required: true
  },
  idOfPoster: {
    type: String, required: true
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
    poster: { type: Number, required: false }
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
    type: String, required: true
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
  sess = req.session;
  if (sess.user) {
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
  } else {
    res.redirect('/');
  }
});

router.post('/addQuestion', (req, res) => {
  sess = req.session;
  if (sess.user) {
    const questionToAdd = req.body.question;
    const notifyToAdd = req.body.notify;
    const tagToAdd = req.body.tag;
    const newQuestion = new Question({
      question: questionToAdd,
      idOfPoster: sess.userID,
      date: Date.now(),
      tag: tagToAdd,
      notify: notifyToAdd,
      answer: 0
    });
    newQuestion.save((err) => {
      if (err) {
        res.send(err);
      }
      res.send('Saved');
    });
  } else {
    res.redirect('/');
  }
});

router.get('/question/:id', (req, res) => {
  sess = req.session;
  if (sess.user) {
    const id = req.params.id;
    if (id.length >= 20) {
      Question.findById(id, (err, uniqueQuestion) => {
        if (err) {
          throw err;
        }
        Answer.find({ questionid: id }).sort({ date: -1 }).exec((err, uniqueAnswers) => {
          res.render('pages/question.ejs', { question: uniqueQuestion, uniqueAnswer: uniqueAnswers, user: sess });
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
  } else {
    res.redirect('/');
  }
});

router.post('/addAnswer', (req, res) => {
  sess = req.session;
  if (sess.user) {
    const answer = req.body.answer;
    const questionId = req.body.questionid;
    const userId = sess.userID;
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
        Question.findByIdAndUpdate(questionId, { $inc: { answer: 1 } }, (err) => {
          if (err) {
            throw err;
          }
        });
        res.send('Added');
      }
    });
  } else {
    res.redirect('/');
  }
});

router.post('/search', (req, res) => {
  sess = req.session;
  if (sess.user) {
    const searchTerm = req.body.term;
    Question.find({ question: new RegExp(searchTerm, 'i') }).limit(5).exec((err, doc) => {
      if (err) {
        throw err;
      }
      res.send(doc);
    });
  } else {
    res.redirect('/');
  }
});

router.post('/addvote', (req, res) => {
  sess = req.session;
  if (sess.user) {
    const userId = sess.userID;
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
  } else {
    res.redirect('/');
  }
});

router.post('/delete', (req, res) => {
  sess = req.session;
  if (sess.user) {
    const type = req.body.type;
    const key = req.body.key;
    if (type === 'question') {
      Question.findByIdAndRemove(key).exec((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send('Deleted');
        }
      });
    } else {
      Answer.findByIdAndRemove(key).exec((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send('Deleted');
        }
      });
    }
  } else {
    res.redirect('/');
  }
});

router.post('/saveEdits', (req, res) => {
  sess = req.session;
  if (sess.user) {
    const type = req.body.type;
    const val = req.body.val;
    const id = req.body.key;
    if (type === 'question') {
      Question.findById(id, (err, questionToSave) => {
        questionToSave.question = val;
        questionToSave.save();
      });
    } else {
      Answer.findById(id, (err, answerToSave) => {
        answerToSave.question = val;
        answerToSave.save();
      });
    }
    res.send('Saved');
  } else {
    res.redirect('/');
  }
});
export default router;
