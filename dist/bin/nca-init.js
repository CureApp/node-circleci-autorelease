'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = run;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _autoreleaseYml = require('../lib/autorelease-yml');

var _autoreleaseYml2 = _interopRequireDefault(_autoreleaseYml);

var _workingDirectory = require('../lib/working-directory');

var _workingDirectory2 = _interopRequireDefault(_workingDirectory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filename = _autoreleaseYml2.default.filename; /*eslint no-console: 0 */

function run() {

    var rootDir = new _workingDirectory2.default().resolve();

    var arYml = _autoreleaseYml2.default.loadFromDir(rootDir);

    if (arYml.loaded) {
        console.log(FILE_ALREADY_EXISTS);
        process.exit(0);
    }

    if (process.env.DRY_RUN) {
        console.log(_chalk2.default.green('[DRY RUN] generating ' + filename));
        console.log(_chalk2.default.green(arYml.toString()));
    } else {
        arYml.saveTo(rootDir);
        console.log(_chalk2.default.green(filename + ' was successfully generated!'));
        console.log(WHAT_TO_DO_NEXT);
    }
}

var FILE_ALREADY_EXISTS = '\n-----------------------------------------------------------------\n    ' + filename + ' already exists.\n\n    Reflect the setting to circle.yml via the following command:\n\n        $(npm bin)/nca generate\n-----------------------------------------------------------------\n';

var WHAT_TO_DO_NEXT = '\n-----------------------------------------------------------------\n    What you do next:\n\n    1. Edit the setting\n\n        $EDITOR ' + filename + '\n\n      see https://github.com/CureApp/node-circleci-autorelease\n\n    2. Reflect it to circle.yml\n\n        $(npm bin)/nca generate\n\n-----------------------------------------------------------------\n';

if (require.main === module) run();