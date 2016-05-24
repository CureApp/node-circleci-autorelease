/*eslint no-console: 0 */
// @flow

import exec from '../util/exec'
import program from 'commander'

export default function run() {

    program
        .option('--depth <module depth>', 'depth of npm modules to update', parseInt)
        .parse(process.argv)

    const {depth} = program

    if (getMajorNpmVersion() < 3) {
        console.log(WHY_NPM2_IS_NOT_RECOMMENDED)
        exec(`npm update --depth ${depth}`)
    }
    else {
        exec(`npm update --dev --depth ${depth}`)
    }
}

function getMajorNpmVersion() {
    return Number(exec('npm -v', {silent: true}).stdout.split('.')[0])
}

const WHY_NPM2_IS_NOT_RECOMMENDED = `
---------------------------------------------------------------
  To update node_modules, npm version should be 3 or more.

  This is because npm v2 has a bug that it tries to install
  devDependencies of submodules when --dev option is set.

  https://github.com/npm/npm/issues/5554

  As a workaround, we omit updating devDependencies in npm v2.
----------------------------------------------------------------
`


if (require.main === module) run()
