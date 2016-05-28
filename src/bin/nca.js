#!/usr/bin/env node
/*eslint no-console: 0 */
// @flow

import fs from 'fs'
import PackageJSONLoader from '../lib/package-json-loader'
import program from 'commander'

const version = PackageJSONLoader.load(__dirname + '/../..').version
program.version(version)

const subcommands = {
    'init'           : 'add .autorelease.yml to your project',
    'generate'       : 'generate circle.yml',
    'bmp'            : 'generate circle.yml and bumping version',
    'update-modules' : 'update node modules',
    'release'        : 'release current version',
    'gh-pages'       : 'create "gh-pages" branch for documentation',
    'notice'         : 'show notice',
    'run'            : 'execute commands at releasable timings',
}

Object.keys(subcommands)
    .filter(sub => fs.existsSync(__dirname + '/nca-' + sub + '.js'))
    .forEach(sub => program.command(sub, subcommands[sub]))


export function run(args: Array<string>) {
    const argv = args.slice()
    argv.unshift(process.execPath, __filename)
    program.parse(argv)
}

if (require.main === module) run(process.argv.slice(2))
