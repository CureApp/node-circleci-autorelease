/*eslint no-console: 0 */
// @flow

import fs from 'fs'
import {join} from 'path'
import chalk from 'chalk'
import WorkingDirectory from '../lib/working-directory'
import AutoreleaseYml from '../lib/autorelease-yml'
import CircleYml from '../lib/circle-yml'

export default function run() {

    const rootDir = new WorkingDirectory().resolve()

    const arYml = AutoreleaseYml.loadFromDir(rootDir)

    arYml.checkFormat()

    const ymlStr = CircleYml.generate(arYml) 

    const filename = join(rootDir, 'circle.yml')

    if (process.env.DRY_RUN) {
        console.log(chalk.green('[DRY RUN] generating circle.yml'))
        console.log(chalk.green(ymlStr))
    }
    else {
        fs.writeFileSync(filename, ymlStr)
    }

    console.log(chalk.green('circle.yml was successfully generated!'))
    console.log(WHAT_TO_DO_NEXT)
}


const WHAT_TO_DO_NEXT = `
-----------------------------------------------------------------
    What you do next:

    1. check your circle.yml

        $EDITOR circle.yml

    2. commit the changes

        git add -A
        git commit -m "add circle.yml"

    3. version bumping

        $(npm bin)/nca bmp p # patch level version up
        $(npm bin)/nca bmp m # minor level version up
        $(npm bin)/nca bmp j # major level version up

-----------------------------------------------------------------
`



if (require.main === module) run()
