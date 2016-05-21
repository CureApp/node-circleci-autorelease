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

    fs.writeFileSync(filename, ymlStr)

    console.log(chalk.green('circle.yml was successfully generated!'))
}

if (require.main === module) run()
