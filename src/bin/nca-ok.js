/*eslint no-console: 0 */
// @flow

import ReleasabilityChecker from '../lib/releasability-checker'

export default function run() {
    const checker = new ReleasabilityChecker()
    const warnMessage = checker.check()
    const code = warnMessage ? 1 : 0
    process.exit(code)
}

if (require.main === module) run()
