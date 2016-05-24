/*eslint no-console: 0 */
// @flow
import {exec as shellJSExec} from 'shelljs'
import chalk from 'chalk'

export default function exec(command: string, options?: Object = {}): Object {

    const dryRun = !!process.env.DRY_RUN

    options.silent = true

    console.log(chalk.green(`${dryRun ? '[DRY RUN]': 'executing'} "${command}"`))

    if (dryRun) {
        return {command, stdout: '[DRY RUN]', stderr: '[DRY RUN]'}
    }
    else {
        return shellJSExec(command, options)
    }
}
