'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = run;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _autoreleaseYml = require('../lib/autorelease-yml');

var _autoreleaseYml2 = _interopRequireDefault(_autoreleaseYml);

var _workingDirectory = require('../lib/working-directory');

var _workingDirectory2 = _interopRequireDefault(_workingDirectory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint no-console: 0 */
var filename = _autoreleaseYml2.default.filename;
function run() {

    _commander2.default.option('-n, --node', 'attach current node.js information').parse(process.argv);

    var rootDir = new _workingDirectory2.default().resolve();

    var arYml = _autoreleaseYml2.default.loadFromDir(rootDir);

    if (arYml.loaded) {
        console.log(FILE_ALREADY_EXISTS);
        process.exit(0);
    }

    if (_commander2.default.node) {
        arYml.setNodeVersion(process.version.slice(1)); // slice(1): strip 'v'
    }

    if (process.env.DRY_RUN) {
        console.log(_chalk2.default.yellow('[DRY RUN]: generating ' + filename));
        console.log(_chalk2.default.yellow(arYml.toString()));
    } else {
        arYml.saveTo(rootDir);
        console.log(_chalk2.default.green(filename + ' was successfully generated!'));
        console.log(WHAT_TO_DO_NEXT);
    }
}

var FILE_ALREADY_EXISTS = '\n-----------------------------------------------------------------\n    ' + filename + ' already exists.\n\n    Reflect the setting to circle.yml via the following command:\n\n        $(npm bin)/nca generate\n-----------------------------------------------------------------\n';

var WHAT_TO_DO_NEXT = '\n-----------------------------------------------------------------\n    What you do next:\n\n    1. Edit the setting\n\n        $EDITOR ' + filename + '\n\n      You can remove all the meaningless \'echo\' commands in hooks.\n\n      see https://github.com/CureApp/node-circleci-autorelease\n\n    2. Reflect it to circle.yml\n\n        $(npm bin)/nca generate\n\n-----------------------------------------------------------------\n';

if (require.main === module) run();