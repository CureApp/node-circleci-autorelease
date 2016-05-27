'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = run;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _releasabilityChecker = require('../lib/releasability-checker');

var _releasabilityChecker2 = _interopRequireDefault(_releasabilityChecker);

var _releaseExecutor = require('../lib/release-executor');

var _releaseExecutor2 = _interopRequireDefault(_releaseExecutor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint no-console: 0 */
function run() {

    _commander2.default.option('--prefix <version prefix>', 'version prefix').option('--branch', 'create branch').option('--shrinkwrap', 'make shrinkwrap.json').parse(process.argv);

    var prefix = _commander2.default.prefix;
    var branch = _commander2.default.branch;
    var shrinkwrap = _commander2.default.shrinkwrap;

    // get version

    var ver = checkReleasability();
    var version = prefix + ver;

    // release
    var executor = new _releaseExecutor2.default();
    var result = executor.release(version, shrinkwrap, branch);
    if (result) {
        console.log(_chalk2.default.green('The tag "' + version + '" was successfully released.'));
    } else {
        console.log(_chalk2.default.red(SHOW_HOW_TO_RELEASE_IN_CIRCLE_CI));
        process.exit(0);
    }

    // npm publish
    var _process$env = process.env;
    var NPM_EMAIL = _process$env.NPM_EMAIL;
    var NPM_AUTH = _process$env.NPM_AUTH;

    if (NPM_EMAIL && NPM_AUTH) {
        executor.publishNpm(NPM_EMAIL, NPM_AUTH);
    } else {
        var _process$env2 = process.env;
        var CIRCLE_PROJECT_USERNAME = _process$env2.CIRCLE_PROJECT_USERNAME;
        var CIRCLE_PROJECT_REPONAME = _process$env2.CIRCLE_PROJECT_REPONAME;

        console.log(SHOW_HOW_TO_NPM_PUBLISH(CIRCLE_PROJECT_USERNAME, CIRCLE_PROJECT_REPONAME));
    }
}

var SHOW_HOW_TO_RELEASE_IN_CIRCLE_CI = function SHOW_HOW_TO_RELEASE_IN_CIRCLE_CI(userName, repoName) {
    return '\n----------------------------------------------------------------------\n    Release failed.\n\n    In most cases, it is due to the ssh key registered in CircleCI.\n    Check the key have permission to write to github.\n\n    https://circleci.com/gh/' + userName + '/' + repoName + '\n\n----------------------------------------------------------------------\n';
};

var SHOW_HOW_TO_NPM_PUBLISH = function SHOW_HOW_TO_NPM_PUBLISH(userName, repoName) {
    return '\n-----------------------------------------------------------------------------------------------------\n    \'npm publish\' was not executed as $NPM_AUTH and $NPM_EMAIL environment variables does not exist.\n\n    Set it at\n        https://circleci.com/gh/' + userName + '/' + repoName + '/edit#checkout\n\n    Name: NPM_AUTH\n    Value: (value of \'_auth\' at your .npmrc after \'npm login\')\n\n    Name: NPM_EMAIL\n    Value: (your email registered to npm)\n-----------------------------------------------------------------------------------------------------\n';
};

function checkReleasability() {

    var checker = new _releasabilityChecker2.default();
    var warnMessage = checker.check();

    if (warnMessage) {
        console.error(_chalk2.default.yellow(warnMessage));
        process.exit(0);
    }

    return checker.getVersionFromLog();
}

if (require.main === module) run();