/*eslint no-console: 0 */
// @flow

import {spawn} from 'child_process'
import ReleasabilityChecker from '../lib/releasability-checker'

export default function run(argv: Array<string>) {

    const checker = new ReleasabilityChecker()
    const command = argv.join(' ')

    if (!checker.isReleasable) {
        console.log(`Non-releasable state, skip command: "${command}"`)
        return process.exit(0)
    }
    console.log(`executing "${command}"`)

    const [bin, ...args] = argv
    spawn(bin, args, {stdio: 'inherit'})

}

if (require.main === module) run(process.argv.slice(2))
