'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exec;

var _shelljs = require('shelljs');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint no-console: 0 */


var CHECK_OK = '✓';
var CHECK_NG = '✖';

function exec(command) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


    var dryRun = !!process.env.DRY_RUN;

    options.silent = true;

    if (dryRun) {
        console.log(_chalk2.default.yellow('[DRY RUN]: ' + command));
        return { command: command, stdout: '[DRY RUN]', stderr: '[DRY RUN]', code: 0 };
    } else {
        var result = (0, _shelljs.exec)(command, options);
        var succeeded = result.code === 0;
        var color = succeeded ? 'green' : 'red';
        var check = succeeded ? CHECK_OK : CHECK_NG;
        console.log(_chalk2.default[color](' ' + check + '  ' + command));

        if (!succeeded) {
            console.log('\tSTDOUT: ');
            console.log(_chalk2.default.red(result.stdout));
            console.error('\tSTDERR: ');
            console.error(_chalk2.default.red(result.stderr));
        }

        return result;
    }
}