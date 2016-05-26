'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _shelljs = require('shelljs');

var _exec2 = require('../util/exec');

var _exec3 = _interopRequireDefault(_exec2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GhPagesCreator = function () {
    function GhPagesCreator() {
        _classCallCheck(this, GhPagesCreator);
    }

    _createClass(GhPagesCreator, [{
        key: 'create',


        /**
         * @public
         */
        value: function create(dir) {
            var _this = this;

            var remote = arguments.length <= 1 || arguments[1] === undefined ? 'origin' : arguments[1];

            if (!(dir === undefined || typeof dir === 'string')) {
                throw new TypeError('Value of optional argument "dir" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(dir));
            }

            if (!(remote === undefined || typeof remote === 'string')) {
                throw new TypeError('Value of optional argument "remote" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(remote));
            }

            this.exec('git checkout --orphan gh-pages');

            if (dir) {

                this.exec('git reset');
                this.exec('add_circle_yml');
                this.exec('git add -f ' + dir);
                this.exec('git clean -fdx');

                (0, _shelljs.ls)(dir).forEach(function (file) {
                    _this.exec('git mv ' + dir + '/' + file + ' .');
                });
            }

            this.exec('git commit -m "gh-pages"');
            this.exec('git push --force ' + remote + ' gh-pages');
        }

        /**
         * execute a given command
         * @private
         */

    }, {
        key: 'exec',
        value: function exec() {
            function _ref(_id) {
                if (!(_id instanceof Object)) {
                    throw new TypeError('Function return value violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(_id));
                }

                return _id;
            }

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (!Array.isArray(args)) {
                throw new TypeError('Value of argument "args" violates contract.\n\nExpected:\nArray<any>\n\nGot:\n' + _inspect(args));
            }

            return _ref(_exec3.default.apply(undefined, args));
        }
    }]);

    return GhPagesCreator;
}();

exports.default = GhPagesCreator;

function _inspect(input, depth) {
    var maxDepth = 4;
    var maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input === 'undefined' ? 'undefined' : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(function (item) {
                    return _inspect(item, depth) === first;
                })) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(function (item) {
                            return _inspect(item, depth);
                        }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        var indent = '  '.repeat(depth - 1);
        var entries = keys.slice(0, maxKeys).map(function (key) {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}