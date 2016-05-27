'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _exec2 = require('../util/exec');

var _exec3 = _interopRequireDefault(_exec2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NON_RELEASE_COMMIT_MESSAGE = '\n----------------------------------------------------------------\n    No release process is going to start, because\n    the latest commit log is not valid.\n    Run one of the following command to get valid commit log.\n\n        $(npm bin)/nca bmp p # patch level (0.0.1)\n        $(npm bin)/nca bmp m # minor level (0.1.0)\n        $(npm bin)/nca bmp j # major level (1.0.0)\n        $(npm bin)/nca bmp r # re-release  (0.0.0)\n\n    Valid commit log message formats are the followings.\n    These are automatically set via the commands above.\n\n        release X.Y.Z\n        re-release X.Y.Z\n\n----------------------------------------------------------------\n';

/**
 * Checker for releasability
 */

var ReleasabilityChecker = function () {
    function ReleasabilityChecker() {
        _classCallCheck(this, ReleasabilityChecker);
    }

    _createClass(ReleasabilityChecker, [{
        key: 'check',


        /**
         * @public
         */
        value: function check() {
            var logVersion = this.getVersionFromLog();
            if (!logVersion) {
                return NON_RELEASE_COMMIT_MESSAGE;
            }
        }

        /**
         * @public
         */

    }, {
        key: 'getVersionFromLog',
        value: function getVersionFromLog() {

            var commitMsg = this.exec('git log --pretty=format:"%s" -1', { silent: true }).stdout;

            if (!commitMsg.match(/^(re-)?release +[0-9]+\./)) {
                return null;
            }

            return commitMsg.split(/release +/)[1];
        }
    }, {
        key: 'exec',
        value: function exec() {
            return _exec3.default.apply(undefined, arguments);
        }
    }]);

    return ReleasabilityChecker;
}();

exports.default = ReleasabilityChecker;