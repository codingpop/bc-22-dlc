import express from 'express';
import Course from '../models/course';

const router = express.Router();

router.get('/', (req, res) => {
  Course.find((err, data) => {
    if (err) throw err;
    res.render('index', { items: data });
  }).sort({_id : -1 }).limit(6);
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
  res.render('profile');
});

module.exports = router;
