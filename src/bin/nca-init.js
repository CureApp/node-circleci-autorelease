/*eslint no-console: 0 */
// @flow

import fs from 'fs'
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

    generateReleaseIgnoreFile(rootDir)

    generateYml(rootDir)

    if (!process.env.DRY_RUN) console.log(WHAT_TO_DO_NEXT)

}

function generateReleaseIgnoreFile(rootDir) {

    if (fs.existsSync(rootDir + '/.releaseignore')) {
        console.log(chalk.yellow('.releaseignore already exists.'))
        return
    }

    const contents = (fs.existsSync(rootDir + '/.gitignore'))
        ? fs.readFileSync(rootDir + '/.gitignore', 'utf8')
        : '#write down files to ignore in release tags.\n'

    if (process.env.DRY_RUN) {
        console.log(chalk.yellow('[DRY RUN]: generating .releaseignore'))
        console.log(chalk.yellow(contents))
    }
    else {
        fs.writeFileSync(rootDir + '/.releaseignore', contents)
        console.log(chalk.green('.releaseignore was successfully generated!'))
    }
}

function generateYml(rootDir: string) {

    const arYml = AutoreleaseYml.loadFromDir(rootDir)

    if (arYml.loaded) {
        console.log(chalk.yellow(`${filename} already exists.`))
        return
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
    }
}

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
