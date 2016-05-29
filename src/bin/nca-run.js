/*eslint no-console: 0 */
// @flow

import {spawn} from 'child_process'
import exec from '../util/exec'
import ReleasabilityChecker from '../lib/releasability-checker'

export default function run(argv: Array<string>) {

    const command = argv.join(' ')

    if (!isReleasable()) {
        console.log(`Non-releasable state, skip command: "${command}"`)
        return process.exit(0)
    }

    console.log(`executing "${command}"`)

    const [bin, ...args] = argv
    spawn(bin, args, {stdio: 'inherit'})
}

function isReleasable(): boolean {

    if (isReleaseFinished()) {
        return true
    }

    const checker = new ReleasabilityChecker()
    return checker.isReleasable
}

// Currently, we regard it as "release finished" that
// the pushed branch name differs from current one.
function isReleaseFinished(): boolean {
    const currentBranch = exec('git rev-parse --abbrev-ref HEAD', {silent: true}).stdout.trim()
    return process.env.CIRCLECI && process.env.CIRCLE_BRANCH != currentBranch
}



if (require.main === module) run(process.argv.slice(2))
