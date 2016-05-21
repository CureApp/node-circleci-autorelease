#!/usr/bin/env node
// @flow

import fs from 'fs'
import PackageJSONLoader from '../lib/package-json-loader'

const version = PackageJSONLoader.load(__dirname + '/../..').version

const program = require('commander')
    .version(version)

const subcommands = {
    'bmp'            : 'generate circle.yml and bumping version',
    'generate'       : 'generate circle.yml',
    'update-modules' : 'update node modules',
    'release'        : 'release current version',
    'notice'         : 'show notice',
}

Object.keys(subcommands)
    .filter(sub => fs.existsSync(__dirname + '/nca-' + sub + '.js'))
    .forEach(sub => program.command(sub, subcommands[sub]))

program.parse(process.argv)
