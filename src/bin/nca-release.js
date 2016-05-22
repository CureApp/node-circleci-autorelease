/*eslint no-console: 0 */
// @flow

import program from 'commander'
import chalk from 'chalk'
import ReleasabilityChecker from '../lib/releasability-checker'

export default function run() {

    program
        .option('--prefix <version prefix>', 'version prefix')
        .option('--branch', 'create branch')
        .option('--shrinkwrap', 'make shrinkwrap.json')
        .parse(process.argv)


    checkReleasability()

}

function checkReleasability() {

    const warnMessage = new ReleasabilityChecker().check()
    if (warnMessage) {
        console.error(chalk.yellow(warnMessage))
        process.exit(0)
    }
}

if (require.main === module) run()
