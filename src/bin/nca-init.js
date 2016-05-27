/*eslint no-console: 0 */
// @flow

import chalk from 'chalk'
import program from 'commander'
import AutoreleaseYml from '../lib/autorelease-yml'
import WorkingDirectory from '../lib/working-directory'

const {filename} = AutoreleaseYml

export default function run() {

    program
        .option('-n, --node', 'attach current node.js information')
        .parse(process.argv)

    const rootDir = new WorkingDirectory().resolve()

    const arYml = AutoreleaseYml.loadFromDir(rootDir)

    if (arYml.loaded) {
        console.log(FILE_ALREADY_EXISTS)
        process.exit(0)
    }

    if (program.node) {
        arYml.setNodeVersion(process.version.slice(1)) // slice(1): strip 'v'
    }

    if (process.env.DRY_RUN) {
        console.log(chalk.yellow(`[DRY RUN]: generating ${filename}`))
        console.log(chalk.yellow(arYml.toString()))
    }
    else {
        arYml.saveTo(rootDir)
        console.log(chalk.green(`${filename} was successfully generated!`))
        console.log(WHAT_TO_DO_NEXT)
    }
}


const FILE_ALREADY_EXISTS = `
-----------------------------------------------------------------
    ${filename} already exists.

    Reflect the setting to circle.yml via the following command:

        $(npm bin)/nca generate
-----------------------------------------------------------------
`

const WHAT_TO_DO_NEXT = `
-----------------------------------------------------------------
    What you do next:

    1. Edit the setting

        $EDITOR ${filename}

      You can remove all the meaningless 'echo' commands in hooks.

      see https://github.com/CureApp/node-circleci-autorelease

    2. Reflect it to circle.yml

        $(npm bin)/nca generate

-----------------------------------------------------------------
`

if (require.main === module) run()
