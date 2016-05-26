#!/usr/bin/env node
'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _packageJsonLoader = require('../lib/package-json-loader');

var _packageJsonLoader2 = _interopRequireDefault(_packageJsonLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = _packageJsonLoader2.default.load(__dirname + '/../..').version;

var program = require('commander').version(version);

var subcommands = {
    'init': 'add .autorelease.yml to your project',
    'generate': 'generate circle.yml',
    'bmp': 'generate circle.yml and bumping version',
    'update-modules': 'update node modules',
    'release': 'release current version',
    'gh-pages': 'create "gh-pages" branch for documentation',
    'notice': 'show notice'
};

Object.keys(subcommands).filter(function (sub) {
    return _fs2.default.existsSync(__dirname + '/nca-' + sub + '.js');
}).forEach(function (sub) {
    return program.command(sub, subcommands[sub]);
});

program.parse(process.argv);