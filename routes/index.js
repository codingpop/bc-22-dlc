import express from 'express';
import Course from '../models/course';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', (req, res) => {
  const result = [];
  Course.find((err, data) => {
    if (err) throw err;
    res.render('dashboard', { items: data });
  });
});

router.get('/watch', (req, res) => {
  res.render('watch');
});

router.get('/watch/:id', (req, res) => {
  const idValue = req.params.id;
  Course.findOne({ _id: idValue }, (err, data) => {
    if (err) throw err;
    console.log(data);
    res.render('watch', { item: data });
  });
});

module.exports = router;
