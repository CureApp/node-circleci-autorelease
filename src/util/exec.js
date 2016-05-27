/*eslint no-console: 0 */
// @flow
import {exec as shellJSExec} from 'shelljs'
import chalk from 'chalk'

const CHECK_OK = '✓'
const CHECK_NG = '✖'

export default function exec(command: string, options?: {silent?: boolean} = {}): Object {

    const dryRun = !!process.env.DRY_RUN

    const log = options.silent ?   function(){} : console.log.bind(console)
    const error = options.silent ? function(){} : console.error.bind(console)

    if (dryRun) {
        log(chalk.yellow(`[DRY RUN]: ${command}`))
        return {command, stdout: '[DRY RUN]', stderr: '[DRY RUN]', code: 0}
    }
    else {
        const result = shellJSExec(command, {silent: true})
        const succeeded = result.code === 0
        const color = succeeded ? 'green': 'red'
        const check = succeeded ? CHECK_OK : CHECK_NG
        log(chalk[color](` ${check}  ${command}`))

        if (!succeeded) {
            log('\tSTDOUT: ')
            log(chalk.red(result.stdout))
            error('\tSTDERR: ')
            error(chalk.red(result.stderr))
        }

        return result
    }
}
