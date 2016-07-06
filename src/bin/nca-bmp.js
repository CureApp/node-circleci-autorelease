/*eslint no-console: 0 */
// @flow

import {which} from 'shelljs'
import exec from '../util/exec'
import program from 'commander'
import fs from 'fs'
import chalk from 'chalk'
import WorkingDirectory from '../lib/working-directory'
import PackageJSONLoader from '../lib/package-json-loader'
import generateCircleYml from './nca-generate'

const COMMAND_DESC = `
  bump-level:
    p: patch level (0.0.1)
    m: minor level (0.1.0)
    j: major level (1.0.0)
    r: re-release (0.0.0)
`

const optionNames = {
    p: 'patch',
    m: 'minor',
    j: 'major',
}


export default function run() {

    program
        .arguments('<bump-level>', /[pmjr]/)
        .option('-s, --skipCircle', 'No generation of circle.yml')
        .description(COMMAND_DESC)
        .parse(process.argv)

    const arg = program.args[0]

    if (!arg) {
        program.help()
    }

    const bin = getBmpBin()

    if (!bin) {
        console.log(chalk.red(HOW_TO_INSTALL_BMP_OR_YANGPAO))
        process.exit(1)
    }

    if (program.skipCircle) {
        console.log('skip generating circle.yml')
    }
    else {
        generateCircleYml(true) // skip showing what to do next
        console.log(HOW_TO_SKIP_GENERATION_OF_CIRCLE_YML)
    }

    const verb = arg === 'r' ? 're-release' : 'release'

    const optionName = optionNames[arg]

    if (optionName) {
        exec(`${bin} --${optionName}`)
    }

    const version = getCurrentVersion()

    exec('git add -A')
    exec(`git commit --allow-empty -m "${verb} ${version}"`)
    console.log(NOTICE_AFTER_BUMPING)

    return 0
}


/**
 * Get the current version
 * @private
 */
function getCurrentVersion(): string {
    const cwd = new WorkingDirectory().resolve()
    return PackageJSONLoader.load(cwd).version
}

/**
 * Get bmp|yangpao full path
 * @private
 */
function getBmpBin(): string {
    const cwd = new WorkingDirectory().resolve()

    if (fs.existsSync(cwd + '/.yangpao.toml')) {
        return which('yangpao')
    }
    if (fs.existsSync(cwd + '/.bmp.yml')) {
        return which('bmp')
    }
}


const HOW_TO_SKIP_GENERATION_OF_CIRCLE_YML = `

    To skip circle.yml generation,
    run with --skipCircle (or -s) option.

`

const HOW_TO_INSTALL_BMP_OR_YANGPAO = `
    You need to install one of the version-bumping tools of the followings,

        - [bmp](https://github.com/kt3k/bmp)
        - [yangpao](https://github.com/januswel/yangpao)

    ## install bmp
    \tgem install bmp

    ## install yangpao
    \tgo get github.com/januswel/yangpao

    Make sure to run this command on project root.
`

/**
 * Show notice after git commit
 * @private
 */
const NOTICE_AFTER_BUMPING = `
----------------------------------------------------------------------------
  Before pushing to github, make sure the following settings have been done.

  1. Checkout SSH keys [required]
       Confirm CircleCI setting if your user key is registered.

  2. Set Environment variables for publishing npm [optional]
       Name: NPM_AUTH
       Value: (value of '_auth' at your .npmrc after 'npm login')

       Name: NPM_EMAIL
       Value: (your email registered to npm)

  If you mistakenly ran this command, you can reset by

      git reset HEAD^
                       Don't be upset :)
----------------------------------------------------------------------------
`

if (require.main === module) run()
