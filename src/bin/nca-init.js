/*eslint no-console: 0 */
// @flow

import fs from 'fs'
import chalk from 'chalk'
import AutoreleaseYml from '../lib/autorelease-yml'
import WorkingDirectory from '../lib/working-directory'

const {filename} = AutoreleaseYml

export default function run() {

    const rootDir = new WorkingDirectory().resolve()

    const arYml = AutoreleaseYml.loadFromDir(rootDir)

    if (arYml.loaded) {
        console.log(SHOW_FILE_ALREADY_EXISTS)
        process.exit(0)
    }

    if (process.env.DRY_RUN) {
        console.log(chalk.green(`[DRY RUN] generating ${filename}`))
        console.log(chalk.green(arYml.toString()))
    }
    else {
        arYml.saveTo(rootDir)
        console.log(chalk.green(`${filename} was successfully generated!`))
        console.log(SHOW_WHAT_TO_DO_NEXT)
    }
}


const SHOW_FILE_ALREADY_EXISTS = `
-----------------------------------------------------------------
    ${filename} already exists.

    Reflect the setting to circle.yml via the following command:

        $(npm bin)/nca generate
-----------------------------------------------------------------
`

const SHOW_WHAT_TO_DO_NEXT = `
-----------------------------------------------------------------
    What you do next:

    1. Edit the setting

        $EDITOR ${filename}

      see https://github.com/CureApp/node-circleci-autorelease

    2. Reflect it to circle.yml

        $(npm bin)/nca generate

-----------------------------------------------------------------
`

if (require.main === module) run()
