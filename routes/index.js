import express from 'express';
import Course from '../models/course';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', (req, res) => {
  Course.find((err, data) => {
    if (err) throw err;
    res.render('dashboard', { items: data });
  });
});

router.get('/watch/:id', (req, res) => {
  const idValue = req.params.id;
  Course.findOne({ _id: idValue }, (err, data) => {
    if (err) throw err;
    res.render('watch', { item: data });
  });
});

router.get('/watch/:id/:video', (req, res) => {
  res.render('watch');
});

module.exports = router;
