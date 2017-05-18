/* eslint linebreak-style: ["error", "windows"]*/
import mongoose from 'mongoose';

class Forum {

  constructor() {
    mongoose.connect('mongodb://jchinonso:poly12345@ds143221.mlab.com:43221/fastlearn');
    const db = mongoose.connection;
    db.on('connected', () => {
      console.log('database connected');
    });
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
    this.Question = mongoose.model('Question', question);
    this.Answer = mongoose.model('Answer', answers);
  }
  showForumQuestions() {
    this.Question.find({}).sort({ date: -1 }).limit(10).exec((err, allQuestions) => {
      if (err) {
        throw err;
      } else {
        return allQuestions;
      }
    });
  }
  showTotalQuestion() {
    this.Question.find({}).exec((err, totalQuestion) => {
      if (err) {
        throw err;
      } else {
        return totalQuestion.length;
      }
    });
  }

  addQuestion(questionToAdd, notifyToAdd, tagToAdd, userId) {
    const newQuestion = new this.Question({
      question: questionToAdd,
      idOfPoster: userId,
      date: Date.now(),
      tag: tagToAdd,
      notify: notifyToAdd,
      answer: 0
    });
    newQuestion.save((err) => {
      if (err) {
        return (err);
      }
      return ('Saved');
    });
  }

  addAnswer(answer, questionId, userId){
    const newAnswer = new this.Answer({
      questionid: questionId,
      idOfPoster: userId,
      value: answer,
      date: Date.now()
    });
    let result = 'Added';
    newAnswer.save((err) => {
      if (err) {
        result = err;
      } else {
        this.Question.findByIdAndUpdate(questionId, { $inc: { answer: 1 } }, (err) => {
          if (err) {
            result = err;
          }
        });
        return result;
      }
    });
  }

  search(searchTerm) {
    this.Question.find({ question: new RegExp(searchTerm, 'i') }).limit(5).exec((err, doc) => {
      if (err) {
        return err;
      }
      return doc;
    });
  }

  addVote(userId, answerId){
    this.Answer.findById(answerId, (err, answer) => {
      const voters = answer.voters;
      if (voters.indexOf(userId) < 0) {
        voters.push(userId);
        answer.voters = voters;
        answer.save();
        return ('Done');
      } else {
        return ('You have voted already');
      }
    });
  }

  individualQuestions(id){
    if (id.length >= 20) {
      this.Question.findById(id, (err, uniqueQuestion) => {
        if (err) {
          throw err;
        }
        this.Answer.find({ questionid: id }, (err, uniqueAnswers) => {
          return { question: uniqueQuestion, uniqueAnswer: uniqueAnswers };
        });
      });
    } else {
      this.Question.find({ tag: id }, (err, singleQuestion) => {
        const totalRecords = singleQuestion.length;
        if (err) {
          throw err;
        }
        if (singleQuestion.length === 0) {
          return false;
        } else {
          return { questions: singleQuestion, totalRecord: totalRecords };
        }
      });
    }
  }
}

export default new Forum();
