'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = run;

var _releasabilityChecker = require('../lib/releasability-checker');

var _releasabilityChecker2 = _interopRequireDefault(_releasabilityChecker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function run() {
    var checker = new _releasabilityChecker2.default();
    var warnMessage = checker.check();
    var code = warnMessage ? 1 : 0;
    process.exit(code);
} /*eslint no-console: 0 */


if (require.main === module) run();