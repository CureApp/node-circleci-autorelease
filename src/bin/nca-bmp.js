/*eslint no-console: 0 */

import {exec, which} from 'shelljs'
import program from 'commander'
import chalk from 'chalk'
import WorkingDirectory from '../lib/working-directory'
import PackageJSONLoader from '../lib/package-json-loader'

const COMMAND_DESC = `
  bump-level:
    p: patch level (0.0.1)
    m: minor level (0.1.0)
    j: major level (1.0.0)
    r: re-release (0.0.0)
`


export default function run() {

    program
        .arguments('<bump-level>', /[pmjr]/)
        .description(COMMAND_DESC)
        .parse(process.argv)

    const arg = program.args[0]

    if (!arg) {
        program.help()
    }

    if (! bmpExist()) {
        process.exit(1)
    }

    const verb = arg === 'r' ? 're-release' : 'release'

    exec(`bmp -${arg}`)

    const version = getCurrentVersion()

    exec('git add -A')
    exec(`git commit --allow-empty -m "${verb} ${version}"`)
    showNotice()

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
 * Check if bmp command exists
 * @private
 */
function bmpExist(): boolean {

    if (!which('bmp')) {

        console.error(chalk.yellow(`
            bmp is not installed.
            Try the following command.

            \tgem install bmp\n`.replace(/\n +/g, '\n  ')))

        return false
    }
    return true
}



/**
 * Show notice after git commit
 * @private
 */
function showNotice () {
    console.error(`
--------------------------------------------------------
   if you mistakenly ran this command, you can reset by

       git reset HEAD^


   Don't be upset :) Otherwise,

       git push origin master


   will be the next command.
--------------------------------------------------------
`)
}

if (require.main === module) run()
