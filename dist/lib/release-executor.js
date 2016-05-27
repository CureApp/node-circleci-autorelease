'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _exec3 = require('../util/exec');

var _exec4 = _interopRequireDefault(_exec3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Executes release process
 */

var ReleaseExecutor = function () {
    function ReleaseExecutor() {
        _classCallCheck(this, ReleaseExecutor);
    }

    _createClass(ReleaseExecutor, [{
        key: 'release',


        /**
         * Release the version
         * @public
         * @param version version name formatted as X.Y.Z
         * @param shrinkwrap  [] whether or not to run `npm shrinkwrap`
         * @param branch  whether or not to release branch
         */
        value: function release(version) {
            var shrinkwrap = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var branch = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
            var remote = arguments.length <= 3 || arguments[3] === undefined ? 'origin' : arguments[3];


            this.exec('git checkout -b release-' + version);
            this.ignoreFiles();

            if (shrinkwrap) {
                this.addShrinkwrap();
            }

            this.exec('git add -A');
            this.exec('git commit -m ' + version);
            this.exec('git tag ' + version);

            var _exec2 = this.exec('git push --force ' + remote + ' ' + version);

            var code = _exec2.code;

            if (!this.isPushSucceeded(code)) {
                return false;
            }

            if (branch) {
                this.pushReleaseBranch(version, remote);
            }
            return true;
        }

        /**
         * publish npm
         * @public
         */

    }, {
        key: 'publishNpm',
        value: function publishNpm(email, auth) {
            var path = arguments.length <= 2 || arguments[2] === undefined ? '.npmrc' : arguments[2];


            var npmrc = '_auth=' + auth + '\nemail=' + email + '\n';
            _fs2.default.writeFileSync(path, npmrc);

            this.exec('cp .releaseignore .npmignore');
            this.exec('npm publish');
            this.exec('rm .npmignore');
            this.exec('rm .npmrc');
        }

        /**
        * ignore files in .releaseignore
        * @private
        */

    }, {
        key: 'ignoreFiles',
        value: function ignoreFiles() {
            this.exec('cp .releaseignore .git/info/exclude');
            this.exec('git rm .gitignore');

            var filesToRemove = this.exec('git ls-files --full-name -i --exclude-from .releaseignore').stdout;

            if (filesToRemove) {
                // TODO manage files with space
                this.exec('git rm --cached ' + filesToRemove.split('\n').join(' '));
            }
        }

        /**
         * add shrinkwrap.json before release
         * @private
         */

    }, {
        key: 'addShrinkwrap',
        value: function addShrinkwrap() {
            this.exec('npm prune --production');
            this.exec('npm shrinkwrap');
        }

        /**
         * @check if push succeeded
         * @private
         */

    }, {
        key: 'isPushSucceeded',
        value: function isPushSucceeded(code) {
            return code === 0;
        }

        /**
         * push release branch after pushing tag
         * @private
         */

    }, {
        key: 'pushReleaseBranch',
        value: function pushReleaseBranch(version, remote) {
            this.exec('git add -f circle.yml');
            this.exec('git commit --allow-empty -m "add circle.yml for release"');
            this.exec('git push --force ' + remote + ' release-' + version);
        }

        /**
         * execute a given command
         * @private
         */

    }, {
        key: 'exec',
        value: function exec() {
            return _exec4.default.apply(undefined, arguments);
        }
    }]);

    return ReleaseExecutor;
}();

exports.default = ReleaseExecutor;