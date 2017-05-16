'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * database class
 * @class
 */
var Database =
/**
 *
 * @constructor
 */
function Database() {
  _classCallCheck(this, Database);

  _mongoose2.default.connect('mongodb://jchinonso:poly12345@ds143221.mlab.com:43221/fastlearn');
  var db = _mongoose2.default.connection;
  db.on('connected', function () {
    console.log('database connected');
  });
};

exports.default = new Database();