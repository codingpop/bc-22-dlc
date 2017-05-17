/* eslint linebreak-style: ["error", "windows"]*/
import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/route';

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 3000, () => {
  console.log('App running');
});

app.use('/', router);
