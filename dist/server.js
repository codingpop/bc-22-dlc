'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressValidator = require('express-validator');

var _expressValidator2 = _interopRequireDefault(_expressValidator);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _route = require('./routes/route');

var _route2 = _interopRequireDefault(_route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.set('view engine', 'ejs');
app.use(_express2.default.static('public'));
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use((0, _expressValidator2.default)());
app.use((0, _expressSession2.default)({ secret: 'ssshhhhh' }));
app.use(_bodyParser2.default.json());

app.listen(process.env.PORT || 3000, function () {
  console.log('App running');
});

app.use('/', _route2.default);