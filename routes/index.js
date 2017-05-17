import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard', {});
});

module.exports = router;
