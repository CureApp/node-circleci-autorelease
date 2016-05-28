/*eslint no-console: 0 */
// @flow

import {exec} from 'shelljs'
import ReleasabilityChecker from '../lib/releasability-checker'

export default function run() {

    const checker = new ReleasabilityChecker()
    const {isReleasable} = checker


}

if (require.main === module) run()
