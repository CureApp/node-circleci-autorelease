/*eslint no-console: 0 */
// @flow
import {exec as shellJSExec} from 'shelljs'
import chalk from 'chalk'

const CHECK_OK = '✓'
const CHECK_NG = '✖'

export default function exec(command: string, options?: Object = {}): Object {

    const dryRun = !!process.env.DRY_RUN

    options.silent = true

    if (dryRun) {
        console.log(chalk.yellow(`[DRY RUN]: ${command}`))
        return {command, stdout: '[DRY RUN]', stderr: '[DRY RUN]', code: 0}
    }
    else {
        const result = shellJSExec(command, options)
        const succeeded = result.code === 0
        const color = succeeded ? 'green': 'red'
        const check = succeeded ? CHECK_OK : CHECK_NG
        console.log(chalk[color](` ${check}  ${command}`))

        if (!succeeded) {
            console.log('\tSTDOUT: ')
            console.log(chalk.red(result.stdout))
            console.error('\tSTDERR: ')
            console.error(chalk.red(result.stderr))
        }

        return result
    }
}
